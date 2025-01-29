const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/users');
const candidateRoutes = require('./routes/candidates');
const transactionRoutes = require('./routes/transactions');
const { info, warn, error } = require('./../logs/logger.js');  // Importer le logger

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting-dapp')
  .then(() => {
    info('Connected to MongoDB');  // Log de succès
  })
  .catch((err) => {
    error(`MongoDB connection error: ${err.message}`);  // Log d'erreur
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);  // Log au démarrage du serveur
});
