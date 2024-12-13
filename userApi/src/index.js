const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const userRouter = require('./routes/user')
const healthRouter = require('./routes/health')
const db = require('./dbClient')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configure Swagger for API documentation
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Base API CRUD and Health',
      version: '1.0.0',
      description: 'Simple API for CRUD operations and health check',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
  },
  apis: ['./src/routes/*.js'], // Chemin vers tes fichiers de routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Initialize express app
const app = express()

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));  // Serve index.html file
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes using the imported routers
app.use('/user', userRouter) // Route for user-related API
app.use('/health', healthRouter)  // Route for health check

// Connect to the database and handle errors
db.on('error', (err) => {
  console.error('Database connection error:', err)  // Log database connection errors
});

// Set the port for the server (either from environment or default to 3000)
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)  // Log when the server is successfully started
});

// Export the server for potential testing or further configuration
module.exports = server
