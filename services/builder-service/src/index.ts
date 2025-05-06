import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { CORS_OPTIONS, DEFAULT_PORT, MONGODB_URI } from '@247vitrine/config';

// Routes
import websiteRoutes from './routes/website';
import templateRoutes from './routes/template';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || DEFAULT_PORT + 1; // Default to 3001

// Middleware
app.use(cors(CORS_OPTIONS));
app.use(express.json());

// Routes
app.use('/api/websites', websiteRoutes);
app.use('/api/templates', templateRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Builder service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
