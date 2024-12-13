const predictClassification = require('../services/inferenceService');
const { storePrediction, getPredictionById, getAllPredictions } = require('../services/firestoreService');
const crypto = require('crypto');
const path = require('path');
const { bucket } = require('../config/storage');
require('dotenv').config();

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;
        const id = crypto.randomUUID();

        if (!image) {
            return h.response({
                status: 'fail',
                message: 'Tidak ada gambar yang diunggah'
            }).code(400);
        }

        const fileName = `${id}-${Date.now()}${path.extname(image.hapi.filename)}`;
        const fileUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;

        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            image.on('data', (chunk) => chunks.push(chunk));
            image.on('end', () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    resolve(buffer);
                } catch (err) {
                    reject(err);
                }
            });
            image.on('error', reject);
        });

        // Upload gambar ke bucket
        const file = bucket.file(fileName);
        await file.save(buffer, {
            contentType: image.hapi.headers['content-type']
        });

        const { confidenceScore, label, name, calories, carbon, protein, fat } =
            await predictClassification(model, buffer);

        const createdAt = new Date().toISOString();

        const data = {
            id,
            imageUrl: fileUrl,
            result: label,
            name: name,
            calories,
            carbon,
            protein,
            fat,
            confidenceScore,
            createdAt,
        };

        await storePrediction(data);

        return h.response({
            status: 'success',
            message: confidenceScore > 60
                ? 'Gambar berhasil diprediksi.'
                : 'Gambar berhasil diprediksi, namun confidence score di bawah threshold. Mohon gunakan gambar yang lebih jelas.',
            data,
        }).code(201);
    } catch (error) {
        console.error('Error details:', error);
        return h.response({
            status: 'fail',
            message: error.message,
        }).code(error.statusCode || 500);
    }
}

// Handler untuk mendapatkan prediksi berdasarkan ID
async function getPredictionHandler(request, h) {
    try {
        const { id } = request.params;
        const prediction = await getPredictionById(id);

        if (!prediction) {
            return h.response({
                status: 'fail',
                message: 'Data prediksi tidak ditemukan'
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: prediction
        }).code(200);
    } catch (error) {
        console.error('Error getting prediction:', error);
        return h.response({
            status: 'fail',
            message: error.message
        }).code(500);
    }
}

// Handler untuk mendapatkan semua prediksi
async function getAllPredictionsHandler(request, h) {
    try {
        const { limit } = request.query;
        const predictions = await getAllPredictions(parseInt(limit) || 10);

        return h.response({
            status: 'success',
            data: predictions
        }).code(200);
    } catch (error) {
        console.error('Error getting predictions:', error);
        return h.response({
            status: 'fail',
            message: error.message
        }).code(500);
    }
}

module.exports = {
    postPredictHandler,
    getPredictionHandler,
    getAllPredictionsHandler
};
