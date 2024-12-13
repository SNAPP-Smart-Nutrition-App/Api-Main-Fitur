require('dotenv').config();
const firestore = require('../config/firestore');

async function storePrediction(data) {
    try {
        if (!data || !data.id) {
            throw new Error('Data tidak valid');
        }

        const predictionsRef = firestore.collection('predictions');
        
        await predictionsRef.doc(data.id).set({
            ...data,
            timestamp: new Date()
        });
        
        console.log(`Data berhasil disimpan dengan ID: ${data.id}`);
        return true;
    } catch (error) {
        console.error('Error detail:', error);
        throw new Error(`Gagal menyimpan data ke database: ${error.message}`);
    }
}

async function getAllPredictions(limit = 10) {
    try {
        const predictionsRef = firestore.collection('predictions');
        const snapshot = await predictionsRef
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const predictions = [];
        snapshot.forEach(doc => {
            predictions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return predictions;
    } catch (error) {
        console.error('Error getting predictions:', error);
        throw new Error('Gagal mengambil data prediksi');
    }
}

async function getPredictionById(id) {
    try {
        const docRef = firestore.collection('predictions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return null;
        }

        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error getting prediction:', error);
        throw new Error('Gagal mengambil data prediksi');
    }
}

module.exports = { 
    storePrediction,
    getAllPredictions,
    getPredictionById
};