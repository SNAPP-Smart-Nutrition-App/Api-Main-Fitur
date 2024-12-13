require('dotenv').config();
const firestore = require('../config/firestore');

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

module.exports = { storePrediction };