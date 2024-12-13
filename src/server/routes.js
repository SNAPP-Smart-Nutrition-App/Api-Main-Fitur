const { 
  postPredictHandler, 
  getPredictionHandler, 
  getAllPredictionsHandler 
} = require('./handler');
const Joi = require('@hapi/joi');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
      },
      validate: {
        payload: Joi.object({
          image: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('Gambar yang akan diprediksi')
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/predictions/{id}',
    handler: getPredictionHandler,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/predictions',
    handler: getAllPredictionsHandler,
    options: {
      validate: {
        query: Joi.object({
          limit: Joi.number().min(1).max(100).default(10)
        })
      }
    }
  }
];

module.exports = routes;