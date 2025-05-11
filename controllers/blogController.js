const BlogPost = require('../models/BlogPost');
const Website = require('../models/Website');
const { marked } = require('marked');
const slugify = require('slugify');

/**
 * Erstellt einen neuen Blog-Beitrag
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.createBlogPost = async (req, res) => {
  try {
    const { title, content, summary, tags, categories, status, websiteId } = req.body;
    
    // Überprüfen, ob die Website existiert und dem Benutzer gehört
    const website = await Website.findOne({ _id: websiteId, owner: req.user.id });
    if (!website) {
      return res.status(404).json({ message: 'Website nicht gefunden oder keine Berechtigung' });
    }
    
    // Slug generieren
    const slug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Überprüfen, ob der Slug bereits existiert
    const existingPost = await BlogPost.findOne({ slug, website: websiteId });
    if (existingPost) {
      return res.status(400).json({ message: 'Ein Beitrag mit diesem Titel existiert bereits' });
    }
    
    // Neuen Blog-Beitrag erstellen
    const blogPost = new BlogPost({
      title,
      content,
      summary,
      author: req.user.id,
      website: websiteId,
      tags: tags || [],
      categories: categories || [],
      status: status || 'draft',
      slug
    });
    
    // Blog-Beitrag speichern
    await blogPost.save();
    
    res.status(201).json(blogPost);
  } catch (error) {
    console.error('Fehler beim Erstellen des Blog-Beitrags:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Blog-Beitrags' });
  }
};

/**
 * Aktualisiert einen Blog-Beitrag
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, tags, categories, status, featuredImage } = req.body;
    
    // Blog-Beitrag finden
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog-Beitrag nicht gefunden' });
    }
    
    // Überprüfen, ob die Website dem Benutzer gehört
    const website = await Website.findOne({ _id: blogPost.website, owner: req.user.id });
    if (!website) {
      return res.status(403).json({ message: 'Keine Berechtigung zum Bearbeiten dieses Blog-Beitrags' });
    }
    
    // Wenn der Titel geändert wurde, neuen Slug generieren
    let slug = blogPost.slug;
    if (title && title !== blogPost.title) {
      slug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
      
      // Überprüfen, ob der neue Slug bereits existiert
      const existingPost = await BlogPost.findOne({ 
        slug, 
        website: blogPost.website,
        _id: { $ne: id }
      });
      
      if (existingPost) {
        return res.status(400).json({ message: 'Ein Beitrag mit diesem Titel existiert bereits' });
      }
    }
    
    // Blog-Beitrag aktualisieren
    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;
    blogPost.summary = summary || blogPost.summary;
    blogPost.tags = tags || blogPost.tags;
    blogPost.categories = categories || blogPost.categories;
    blogPost.status = status || blogPost.status;
    blogPost.slug = slug;
    
    if (featuredImage) {
      blogPost.featuredImage = featuredImage;
    }
    
    // Blog-Beitrag speichern
    await blogPost.save();
    
    res.json(blogPost);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Blog-Beitrags:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Blog-Beitrags' });
  }
};

/**
 * Löscht einen Blog-Beitrag
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Blog-Beitrag finden
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog-Beitrag nicht gefunden' });
    }
    
    // Überprüfen, ob die Website dem Benutzer gehört
    const website = await Website.findOne({ _id: blogPost.website, owner: req.user.id });
    if (!website) {
      return res.status(403).json({ message: 'Keine Berechtigung zum Löschen dieses Blog-Beitrags' });
    }
    
    // Blog-Beitrag löschen
    await BlogPost.findByIdAndDelete(id);
    
    res.json({ message: 'Blog-Beitrag erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Blog-Beitrags:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Blog-Beitrags' });
  }
};

/**
 * Ruft einen einzelnen Blog-Beitrag ab
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.getBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Blog-Beitrag finden und Autor-Informationen abrufen
    const blogPost = await BlogPost.findById(id)
      .populate('author', 'firstName lastName email')
      .populate('website', 'title subdomain');
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog-Beitrag nicht gefunden' });
    }
    
    // HTML aus Markdown generieren
    const contentHtml = marked(blogPost.content);
    
    // Blog-Beitrag mit HTML zurückgeben
    res.json({
      ...blogPost.toObject(),
      contentHtml
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Blog-Beitrags:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Blog-Beitrags' });
  }
};

/**
 * Ruft alle Blog-Beiträge für eine Website ab
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.getBlogPostsByWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { status, limit = 10, page = 1, category, tag } = req.query;
    
    // Filter erstellen
    const filter = { website: websiteId };
    
    // Wenn Status angegeben ist, nach Status filtern
    if (status) {
      filter.status = status;
    }
    
    // Wenn Kategorie angegeben ist, nach Kategorie filtern
    if (category) {
      filter.categories = category;
    }
    
    // Wenn Tag angegeben ist, nach Tag filtern
    if (tag) {
      filter.tags = tag;
    }
    
    // Paginierung
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Blog-Beiträge finden
    const blogPosts = await BlogPost.find(filter)
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Gesamtanzahl der Blog-Beiträge für die Paginierung
    const total = await BlogPost.countDocuments(filter);
    
    res.json({
      blogPosts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Blog-Beiträge:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Blog-Beiträge' });
  }
};

/**
 * Fügt einen Kommentar zu einem Blog-Beitrag hinzu
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, content } = req.body;
    
    // Blog-Beitrag finden
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog-Beitrag nicht gefunden' });
    }
    
    // Kommentar hinzufügen
    const comment = {
      name,
      email,
      content,
      user: req.user ? req.user.id : null,
      approved: req.user ? true : false // Automatisch genehmigen, wenn der Benutzer angemeldet ist
    };
    
    blogPost.comments.push(comment);
    await blogPost.save();
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kommentars:', error);
    res.status(500).json({ message: 'Serverfehler beim Hinzufügen des Kommentars' });
  }
};
