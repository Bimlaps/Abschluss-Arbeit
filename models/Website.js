const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebsiteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  subdomain: {
    type: String,
    required: true,
    unique: true
  },
  layout: {
    type: Schema.Types.ObjectId,
    ref: 'Layout',
    required: true
  },
  design: {
    type: Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  colorScheme: {
    type: Schema.Types.ObjectId,
    ref: 'ColorScheme',
    required: true
  },
  content: {
    type: Object,
    default: {}
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  isDemo: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Website', WebsiteSchema);
