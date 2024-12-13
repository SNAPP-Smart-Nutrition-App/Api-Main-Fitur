// src/config/storage.js
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'c242-ps287',
    keyFilename: './gcloud-key.json'
});

module.exports = { storage };