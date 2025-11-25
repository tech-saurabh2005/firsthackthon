import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import workflowRoutes from './Routes/WorkflowRoute.js';
import errorHandler from './Middleware/ErrorHandler.js';
import cors from 'cors';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const URI = process.env.mongoDBURI || process.env.MONGO_URI;

app.use(express.json());

// Enable CORS for frontend running on 3001 (or allow all during development)
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
app.use(cors({ origin: corsOrigin }));

// ======================
// API ROUTES
// ======================
app.use('/api/workflows', workflowRoutes);

// ======================
// STATIC FRONTEND SERVE
// ======================
const frontendPath = path.join(__dirname, '..', 'FrontEnd');

app.use(express.static(frontendPath));

// ======================
// SPA FALLBACK
// Serve the main frontend page if present (safe fallback)
// ======================
app.use((req, res, next) => {
  const candidates = ['index.html', 'fifth3 (3).html'];
  for (const name of candidates) {
    const candidate = path.join(frontendPath, name);
    if (fs.existsSync(candidate)) {
      return res.sendFile(candidate);
    }
  }

  next();
});


app.use(errorHandler);


async function start() {
  try {
    if (URI) {
      await mongoose.connect(URI);
      console.log('Connected to MongoDB');
    } else {
      console.warn('No MongoDB URI provided, skipping DB connection');
    }

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('ERROR!!', error);
    process.exit(1);
  }
}

start();
