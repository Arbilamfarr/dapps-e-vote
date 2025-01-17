const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { hash, from, type, details } = req.body;
    const transaction = new Transaction({ hash, from, type, details });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { address } = req.query;
    const query = address ? { from: address } : {};
    const transactions = await Transaction.find(query).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

module.exports = router;