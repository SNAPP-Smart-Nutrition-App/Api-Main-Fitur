const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
            .div(tf.scalar(255));
        console.log('Tensor shape:', tensor.shape);
console.log('Tensor summary:', tensor.toString());
        const classes = [
            'apple', 'banana', 'beetroot', 'bell pepper', 'cabbage', 'capsicum', 'carrot',
            'cauliflower', 'chilli pepper', 'corn', 'cucumber', 'eggplant', 'garlic',
            'ginger', 'grapes', 'jalepeno', 'kiwi', 'lemon', 'lettuce', 'mango', 'onion',
            'orange', 'paprika', 'pear', 'peas', 'pineapple', 'pomegranate', 'potato',
            'raddish', 'soy beans', 'spinach', 'sweetcorn', 'sweetpotato', 'tomato',
            'turnip', 'watermelon'
        ];

        const nutritionInfo = {
            'apple': { calories: 52, carbon: 14, protein: 0.3, fat: 0.2 },
            'banana': { calories: 89, carbon: 23, protein: 1.1, fat: 0.3 },
            'beetroot': { calories: 43, carbon: 10, protein: 1.6, fat: 0.2 },
            'bell pepper': { calories: 31, carbon: 6, protein: 1, fat: 0.3 },
            'cabbage': { calories: 25, carbon: 6, protein: 1.3, fat: 0.1 },
            'capsicum': { calories: 31, carbon: 6, protein: 1, fat: 0.3 },
            'carrot': { calories: 41, carbon: 10, protein: 0.9, fat: 0.2 },
            'cauliflower': { calories: 25, carbon: 5, protein: 1.9, fat: 0.3 },
            'chilli pepper': { calories: 40, carbon: 9, protein: 1.9, fat: 0.4 },
            'corn': { calories: 86, carbon: 19, protein: 3.2, fat: 1.2 },
            'cucumber': { calories: 15, carbon: 4, protein: 0.7, fat: 0.1 },
            'eggplant': { calories: 25, carbon: 6, protein: 1, fat: 0.2 },
            'garlic': { calories: 149, carbon: 33, protein: 6.4, fat: 0.5 },
            'ginger': { calories: 80, carbon: 18, protein: 1.8, fat: 0.8 },
            'grapes': { calories: 69, carbon: 18, protein: 0.7, fat: 0.2 },
            'jalepeno': { calories: 29, carbon: 7, protein: 0.9, fat: 0.4 },
            'kiwi': { calories: 61, carbon: 15, protein: 1.1, fat: 0.5 },
            'lemon': { calories: 29, carbon: 9, protein: 1.1, fat: 0.3 },
            'lettuce': { calories: 15, carbon: 3, protein: 1.4, fat: 0.2 },
            'mango': { calories: 60, carbon: 15, protein: 0.8, fat: 0.4 },
            'onion': { calories: 40, carbon: 9, protein: 1.1, fat: 0.1 },
            'orange': { calories: 47, carbon: 12, protein: 0.9, fat: 0.1 },
            'paprika': { calories: 31, carbon: 6, protein: 1, fat: 0.3 },
            'pear': { calories: 57, carbon: 15, protein: 0.4, fat: 0.1 },
            'peas': { calories: 81, carbon: 14, protein: 5.4, fat: 0.4 },
            'pineapple': { calories: 50, carbon: 13, protein: 0.5, fat: 0.1 },
            'pomegranate': { calories: 83, carbon: 19, protein: 1.7, fat: 1.2 },
            'potato': { calories: 77, carbon: 17, protein: 2, fat: 0.1 },
            'raddish': { calories: 16, carbon: 3.4, protein: 0.7, fat: 0.1 },
            'soy beans': { calories: 446, carbon: 30, protein: 36.5, fat: 19.9 },
            'spinach': { calories: 23, carbon: 3.6, protein: 2.9, fat: 0.4 },
            'sweetcorn': { calories: 86, carbon: 19, protein: 3.2, fat: 1.2 },
            'sweetpotato': { calories: 86, carbon: 20, protein: 1.6, fat: 0.1 },
            'tomato': { calories: 18, carbon: 3.9, protein: 0.9, fat: 0.2 },
            'turnip': { calories: 28, carbon: 6.4, protein: 0.9, fat: 0.1 },
            'watermelon': { calories: 30, carbon: 8, protein: 0.6, fat: 0.2 }
        };
        
        const fruitNames = {
            'apple': 'Apple (Apel)',
            'banana': 'Banana (Pisang)',
            'beetroot': 'Beetroot (Bit)',
            'bell pepper': 'Bell Pepper (Paprika)',
            'cabbage': 'Cabbage (Kubis)',
            'capsicum': 'Capsicum (Paprika)',
            'carrot': 'Carrot (Wortel)',
            'cauliflower': 'Cauliflower (Kembang Kol)',
            'chilli pepper': 'Chilli Pepper (Cabai)',
            'corn': 'Corn (Jagung)',
            'cucumber': 'Cucumber (Mentimun)',
            'eggplant': 'Eggplant (Terong)',
            'garlic': 'Garlic (Bawang Putih)',
            'ginger': 'Ginger (Jahe)',
            'grapes': 'Grapes (Anggur)',
            'jalepeno': 'Jalapeno (Cabai Jalapeno)',
            'kiwi': 'Kiwi (Kiwi)',
            'lemon': 'Lemon (Lemon)',
            'lettuce': 'Lettuce (Selada)',
            'mango': 'Mango (Mangga)',
            'onion': 'Onion (Bawang Merah)',
            'orange': 'Orange (Jeruk)',
            'paprika': 'Paprika (Paprika)',
            'pear': 'Pear (Pir)',
            'peas': 'Peas (Kacang Polong)',
            'pineapple': 'Pineapple (Nanas)',
            'pomegranate': 'Pomegranate (Delima)',
            'potato': 'Potato (Kentang)',
            'raddish': 'Radish (Lobak)',
            'soy beans': 'Soy Beans (Kedelai)',
            'spinach': 'Spinach (Bayam)',
            'sweetcorn': 'Sweet Corn (Jagung Manis)',
            'sweetpotato': 'Sweet Potato (Ubi Jalar)',
            'tomato': 'Tomato (Tomat)',
            'turnip': 'Turnip (Lobak Putih)',
            'watermelon': 'Watermelon (Semangka)'
        };
        

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        if (!nutritionInfo[label]) {
            throw new InputError(`Data nutrisi untuk ${label} tidak tersedia.`);
        }

        const { calories, carbon, protein, fat } = nutritionInfo[label];

        tensor.dispose();
        prediction.dispose();

        return {
            confidenceScore,
            label,
            name: fruitNames[label] || label,
            calories,
            carbon,
            protein,
            fat,
        };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
