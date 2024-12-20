const {Firestore} = require('@google-cloud/firestore');

require('dotenv').config();
const firestore = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

module.exports = firestore;