const express = require('express');
const Candidate = require('../models/Candidate');
const { info, warn, error } = require('./../../logs/logger.js');  // Importer le logger

const router = express.Router();

// Route to create a candidate
router.post('/', async (req, res) => {
  try {
    const { name, program, blockchainId } = req.body;
    const candidate = new Candidate({ name, program, blockchainId });
    await candidate.save();
    info(`Candidate created: ${candidate.name} - ${candidate.program} - ${candidate.blockchainId}`);
    res.status(201).json(candidate);
  } catch (err) {
    error(`Error creating candidate: ${err.message}`);  // Log de l'erreur
    res.status(500).json({ error: 'Error creating candidate', details: err.message });
  }
});

// Route to fetch all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    info(`Fetched ${candidates.length} candidates`);  // Log d'info pour la récupération des candidats
    res.json(candidates);
  } catch (err) {
    error(`Error fetching candidates: ${err.message}`);  // Log de l'erreur
    res.status(500).json({ error: 'Error fetching candidates', details: err.message });
  }
});

module.exports = router;
