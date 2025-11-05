const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { PORT } = require('./config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Arbitros API Gateway',
      version: '1.0.0',
      description:
        'Express.js API Gateway para manejar árbitros y conectar con el backend Spring Boot',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor local de desarrollo',
      },
    ],
    components: {
      schemas: {
        Arbitro: {
          type: 'object',
          required: ['nombre', 'cedula','username'],
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'Arbitro ID',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Arbitro full name',
              example: 'Juan Pérez'
            },
            cedula: {
              type: 'string',
              description: 'Identification number',
              example: '1234567890'
            },
            username: {
              type: 'string',
              description: 'Username/email',
              example: 'juan.perez@example.com'
            },
            telefono: {
              type: 'string',
              description: 'Phone number',
              example: '+57 300 123 4567'
            },
            experiencia: {
              type: 'string',
              description: 'Experience level',
              example: 'Profesional'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'integer',
              description: 'HTTP status code'
            },
            message: {
              type: 'string',
              description: 'Detailed error message'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'UP'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            springBootApi: {
              type: 'string',
              example: 'http://localhost:8080'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Rutas documentadas con Swagger JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
