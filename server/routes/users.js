const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { address, name, email } = req.body;
    const user = new User({ address, name, email });
    await user.save();
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
    console.error('Error creating user:', error);
  }
});

router.get('/', async (req, res) => {
  try {
    
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:address', async (req,res) => {
  try {
    const user = await User.findOne({ address: req.params.address });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Route pour obtenir le nombre total d'utilisateurs
router.get('/count/voters', async (req, res) => {
  try {
    console.log("count route hit");
    const count = await User.countDocuments();
    console.log("User count:", count);
    res.json(count);
  } catch (error) {
    console.log("Error fetching user count:", error);
    res.status(500).json({ error: 'Error fetching user count' });
  }
});

module.exports = router;