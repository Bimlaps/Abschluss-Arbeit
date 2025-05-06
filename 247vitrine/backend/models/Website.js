const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true
  },
  layout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Layout',
    required: true
  },
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  colorScheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ColorScheme',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    title: String,
    description: String,
    logo: String,
    hero: {
      title: String,
      subtitle: String,
      image: String
    },
    about: {
      title: String,
      text: String,
      image: String
    },
    services: [{
      title: String,
      description: String,
      icon: String
    }],
    contact: {
      email: String,
      phone: String,
      address: String
    },
    // Neue Felder für Social Media Links
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      xing: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    // Neue Felder für Galerie
    gallery: [{
      title: { type: String, required: true },
      description: { type: String, default: '' },
      imageUrl: { type: String, required: true },
      thumbnailUrl: { type: String, default: '' },
      order: { type: Number, default: 0 }
    }],
    // Neue Felder für digitale Visitenkarte
    businessCard: {
      companyName: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      position: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      logo: { type: String, default: '' },
      qrCodeUrl: { type: String, default: '' }
    }
  },
  published: {
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

module.exports = mongoose.model('Website', websiteSchema);
