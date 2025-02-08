import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NodeCache from 'node-cache';
import { carRoutes } from './routes/cars.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Generative AI
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Initialize cache with 1 hour TTL
export const cache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', carRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
