const express = require('express');
const Transaction = require('../models/Transaction');
const { info, warn, error } = require('./../../logs/logger.js');  // Importer le logger

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { hash, from, type, details } = req.body;
    const transaction = new Transaction({ hash, from, type, details });
    await transaction.save();
    info(`Transaction created: ${transaction.hash} - ${transaction.from} - ${transaction.type}`);
    res.status(201).json(transaction);
  } catch (err) {
    error(`Error creating transaction: ${err.message}`);  // Utilisation de error au lieu de warn
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { address } = req.query;
    const query = address ? { from: address } : {};
    const transactions = await Transaction.find(query).sort({ timestamp: -1 });
    info(`Fetched ${transactions.length} transactions for address: ${address || 'all'}`);  // Log d'info pour les transactions récupérées
   console.log("transactions")
    res.json(transactions);
  } catch (err) {
    error(`Error fetching transactions: ${err.message}`);  // Log d'erreur lors de la récupération des transactions
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

module.exports = router;
