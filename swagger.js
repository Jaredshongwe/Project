const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Record Store API',
        description: 'Record Store Api for Cs340 final project'
    },
    host: 'http://localhost:5050',
    schemas: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);