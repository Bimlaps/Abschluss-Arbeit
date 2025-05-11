const express = require('express');
const router = express.Router();
const blogRoutes = require('./blogRoutes');

// Blog-Routen registrieren
router.use('/blog', blogRoutes);

module.exports = router;
