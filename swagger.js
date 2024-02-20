const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Record Store API',
        description: 'Record Store Api for cse341 final project'
    },
    host: 'http://localhost:3000',
    schemas: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);