// 📁 src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Rate limiter (prevent abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
const indexRoutes = require('./routes/index');
app.use(express.json());
app.use(indexRoutes);

// Optional: Error handling middleware
// const errorHandler = require('./middlewares/error.middleware');
// app.use(errorHandler);

module.exports = app;
