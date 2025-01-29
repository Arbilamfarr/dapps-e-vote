const express = require('express');
const User = require('../models/User');
const { info, warn, error } = require('./../../logs/logger.js');  // Importer le logger

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { address, name, email } = req.body;
    const user = new User({ address, name, email });
    await user.save();

    info(`User created: ${name} (Address: ${address})`);  // Log de succès
    res.status(201).json(user);
  } catch (err) {
    error(`Error creating user: ${err.message}`);  // Log d'erreur
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    info(`Fetched ${users.length} users`);  // Log de succès
    res.json(users);
  } catch (err) {
    error(`Error fetching users: ${err.message}`);  // Log d'erreur
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:address', async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address });
    if (!user) {
      warn(`User not found: ${req.params.address}`);  // Log d'avertissement
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    error(`Error fetching user with address ${req.params.address}: ${err.message}`);  // Log d'erreur
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Route pour obtenir le nombre total d'utilisateurs
router.get('/count/voters', async (req, res) => {
  try {
    const count = await User.countDocuments();
    info(`Fetched user count: ${count}`);  // Log de succès
    res.json(count);
  } catch (err) {
    error(`Error fetching user count: ${err.message}`);  // Log d'erreur
    res.status(500).json({ error: 'Error fetching user count' });
  }
});

module.exports = router;
