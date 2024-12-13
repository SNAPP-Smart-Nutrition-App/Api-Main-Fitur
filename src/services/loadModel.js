require('dotenv').config(); 
const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        if (!process.env.MODEL_URL) {
            throw new Error('MODEL_URL tidak ditemukan di environment variables');
        }

        console.log('Loading model from:', process.env.MODEL_URL);
        
        let retries = 3;
        let model;
        
        while (retries > 0) {
            try {
                model = await tf.loadLayersModel(process.env.MODEL_URL, {
                    strict: true,
                    onProgress: (fraction) => {
                        console.log(`Loading progress: ${(fraction * 100).toFixed(1)}%`);
                    }
                });
                break;
            } catch (err) {
                retries--;
                if (retries === 0) throw err;
                console.log(`Retry loading model... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!model) {
            throw new Error('Gagal memuat model setelah beberapa percobaan');
        }

        console.log('Model loaded successfully');
        console.log('Model summary:');
        model.summary();
        
        return model;
    } catch (error) {
        console.error('Error loading model:', error.message);
        console.error('Stack trace:', error.stack);
        throw new Error(`Gagal memuat model: ${error.message}`);
    }
}

module.exports = loadModel;
