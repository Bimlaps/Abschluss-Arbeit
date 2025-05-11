const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  website: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  categories: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    approved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Vor dem Speichern das updatedAt-Datum aktualisieren
BlogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Wenn der Status auf 'published' geändert wird und publishedAt nicht gesetzt ist
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

// Methode zum Generieren eines Slugs aus dem Titel
BlogPostSchema.methods.generateSlug = function() {
  return slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

module.exports = mongoose.model('BlogPost', BlogPostSchema);
