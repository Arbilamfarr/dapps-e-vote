const express = require('express');
const Candidate = require('../models/Candidate');

const router = express.Router();

// Route to create a candidate
router.post('/', async (req, res) => {
  try {
    const { name, program, blockchainId } = req.body;
    const candidate = new Candidate({ name, program, blockchainId });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Error creating candidate', details: error.message });
  }
});

// Route to fetch all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching candidates', details: error.message });
  }
});

module.exports = router;