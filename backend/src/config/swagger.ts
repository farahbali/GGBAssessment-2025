import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import '../docs/feedbackSwagger';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feedback Board API',
      version: '1.0.0',
      description:
        'A comprehensive API for managing feedback items with status workflow, built with Node.js, Express, TypeScript, and MongoDB.',
    },
    servers: [
      { url: process.env.API_URL || 'http://localhost:5000', description: 'Development server' },
      { url: 'https://api.feedbackboard.com', description: 'Production server' },
    ],
  },
  apis: [
    './src/routes/*.ts',       
    './src/controllers/*.ts',   
    './src/docs/feedbackSwagger.ts', 
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Feedback Board API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,//
  },
};

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
