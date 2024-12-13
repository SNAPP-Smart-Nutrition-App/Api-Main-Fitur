const firestore = require('../config/firestore');
const { bucket } = require('../config/storage');
async function storePrediction(data) {
    try {
        // Validasi data
        if (!data || !data.id) {
            throw new Error('Data tidak valid');
        }

        const predictionsRef = firestore.collection('predictions');
        
        // Log untuk debugging
        console.log('Attempting to store data:', {
            id: data.id,
            collection: 'predictions'
        });

        await predictionsRef.doc(data.id).set({
            ...data,
            timestamp: new Date()
        });
        
        console.log(`Data berhasil disimpan dengan ID: ${data.id}`);
        return true;
    } catch (error) {
        console.error('Error detail:', error);
        console.error('Stack trace:', error.stack);
        throw new Error(`Gagal menyimpan data ke database: ${error.message}`);
    }
}

async function getPredictionById(id) {
    try {
        const docRef = firestore.collection('predictions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error('Data prediksi tidak ditemukan');
        }

        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error getting prediction:', error);
        throw new Error(`Gagal mengambil data prediksi: ${error.message}`);
    }
}

async function getAllPredictions(limit = 10) {
    try {
        const predictionsRef = firestore.collection('predictions');
        const snapshot = await predictionsRef
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting predictions:', error);
        throw new Error(`Gagal mengambil data prediksi: ${error.message}`);
    }
}

module.exports = { 
    storePrediction, 
    getPredictionById,
    getAllPredictions 
};