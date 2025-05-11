const mongoose = require('mongoose');

const colorSchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  primary: {
    type: String,
    required: true
  },
  secondary: {
    type: String,
    required: true
  },
  accent: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ColorScheme', colorSchemeSchema);
