const express = require('express');
const app = express();
const arbitroRoutes = require('./routes/arbitro.routes');
const systemRoutes = require('./routes/system.routes');
const setupSwagger = require('./config/swagger');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
setupSwagger(app);

// Routes
app.use('/arbitros', arbitroRoutes);
app.use('/', systemRoutes);

module.exports = app;
