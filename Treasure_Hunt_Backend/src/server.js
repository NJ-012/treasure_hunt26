import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeTables } from './db/init.js';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();

// Allow all origins in production (Vercel frontend URL is dynamic)
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
}, express.static(join(__dirname, '../uploads')));

// Initialize tables on startup (creates tables if they don't exist)
initializeTables();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api', teamRoutes);

// Global Error Handler
app.use(errorHandler);

// Start the Server with EADDRINUSE handling
const PORT = process.env.PORT || 7860;
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}
startServer(Number(PORT));