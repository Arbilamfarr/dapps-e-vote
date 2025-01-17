const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['VOTE', 'REGISTER_VOTER', 'ADD_CANDIDATE', 'START_ELECTION', 'END_ELECTION'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'FAILED'],
    default: 'PENDING',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);