const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Ubah jika Anda ingin mengatur akses hanya untuk domain tertentu
            },
        },
    });

    // Muat model TensorFlow saat server diinisialisasi
    const model = await loadModel();
    server.app.model = model;

    // Tambahkan rute
    server.route(routes);

    // Jalankan server
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
