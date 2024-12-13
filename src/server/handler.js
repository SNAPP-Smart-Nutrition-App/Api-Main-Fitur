const predictClassification = require('../services/inferenceService');
const { storePrediction, getPredictionById, getAllPredictions } = require('../services/firestoreService');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

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

        const { confidenceScore, label, name, calories, carbon, protein, fat } =
            await predictClassification(model, buffer);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            name: name,
            calories,
            carbon,
            protein,
            fat,
            confidenceScore,
            createdAt,
        };

        // Simpan ke Firestore
        await storePrediction(data);

        const response = h.response({
            status: 'success',
            message:
                confidenceScore > 60
                    ? 'Buah berhasil diprediksi.'
                    : 'Buah berhasil diprediksi, namun confidence score di bawah threshold. Mohon gunakan gambar yang lebih jelas.',
            data,
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Error details:', error);
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(error.statusCode || 500);
        return response;
    }
}

async function getPredictionHandler(request, h) {
    try {
        const { id } = request.params;
        const prediction = await getPredictionById(id);

        return h.response({
            status: 'success',
            data: prediction
        }).code(200);
    } catch (error) {
        console.error('Error getting prediction:', error);
        return h.response({
            status: 'fail',
            message: error.message
        }).code(404);
    }
}

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
