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
      email: {
        type: String,
        validate: {
          validator: function(v) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
          },
          message: props => `${props.value} ist keine gültige E-Mail-Adresse!`
        }
      },
      phone: {
        type: String,
        validate: {
          validator: function(v) {
            // Erlaubt Zahlen, Leerzeichen, +, -, () für internationale Formate
            return /^[0-9+\-\s()]*$/.test(v);
          },
          message: props => `${props.value} ist keine gültige Telefonnummer!`
        }
      },
      street: { type: String, default: '' },
      houseNumber: { type: String, default: '' },
      postalCode: {
        type: String,
        default: '',
        validate: {
          validator: function(v) {
            // Wenn leer, dann gültig (nicht erforderlich)
            if (!v) return true;
            // Sonst 5-stellige Zahl für deutsche PLZ
            return /^[0-9]{5}$/.test(v);
          },
          message: props => `${props.value} ist keine gültige Postleitzahl!`
        }
      },
      city: { type: String, default: '' },
      // Für Abwärtskompatibilität
      address: { type: String, default: '' }
    },
    // Neue Felder für Social Media Links
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      whatsapp: {
        type: String,
        default: '',
        validate: {
          validator: function(v) {
            // Wenn leer, dann gültig (nicht erforderlich)
            if (!v) return true;
            // Erlaubt Zahlen, +, -, Leerzeichen für internationale Formate
            return /^[0-9+\-\s]*$/.test(v);
          },
          message: props => `${props.value} ist keine gültige WhatsApp-Nummer!`
        }
      },
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
      street: { type: String, default: '' },
      houseNumber: { type: String, default: '' },
      postalCode: {
        type: String,
        default: '',
        validate: {
          validator: function(v) {
            // Wenn leer, dann gültig (nicht erforderlich)
            if (!v) return true;
            // Sonst 5-stellige Zahl für deutsche PLZ
            return /^[0-9]{5}$/.test(v);
          },
          message: props => `${props.value} ist keine gültige Postleitzahl!`
        }
      },
      city: { type: String, default: '' },
      phone: {
        type: String,
        default: '',
        validate: {
          validator: function(v) {
            // Wenn leer, dann gültig (nicht erforderlich)
            if (!v) return true;
            // Erlaubt Zahlen, Leerzeichen, +, -, () für internationale Formate
            return /^[0-9+\-\s()]*$/.test(v);
          },
          message: props => `${props.value} ist keine gültige Telefonnummer!`
        }
      },
      email: {
        type: String,
        default: '',
        validate: {
          validator: function(v) {
            // Wenn leer, dann gültig (nicht erforderlich)
            if (!v) return true;
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
          },
          message: props => `${props.value} ist keine gültige E-Mail-Adresse!`
        }
      },
      website: { type: String, default: '' },
      logo: { type: String, default: '' },
      qrCodeUrl: { type: String, default: '' },
      // Für Abwärtskompatibilität
      address: { type: String, default: '' }
    },
    // Neue Felder für Öffnungszeiten
    openingHours: [{
      day: { type: String, required: true },
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false }
    }],

    // FAQ-Bereich
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
      order: { type: Number, default: 0 }
    }],

    // Dienstleistungskatalog
    servicesCatalog: {
      title: { type: String, default: 'Unsere Dienstleistungen' },
      description: { type: String, default: 'Hier finden Sie eine Übersicht unserer Dienstleistungen.' },
      categories: [{
        name: { type: String, required: true },
        description: { type: String, default: '' },
        services: [{
          name: { type: String, required: true },
          description: { type: String, default: '' },
          details: { type: String, default: '' },
          icon: { type: String, default: '🔧' },
          imageUrl: { type: String, default: '' }
        }]
      }]
    },

    // Blog/News-Bereich
    blog: {
      title: { type: String, default: 'Aktuelles & Neuigkeiten' },
      description: { type: String, default: 'Hier finden Sie aktuelle Informationen und Neuigkeiten.' },
      posts: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        summary: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        author: { type: String, default: '' },
        publishDate: { type: Date, default: Date.now },
        tags: [{ type: String }],
        slug: { type: String, default: '' }
      }]
    }
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

module.exports = mongoose.model('Website', websiteSchema);
