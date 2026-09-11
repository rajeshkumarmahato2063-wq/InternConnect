import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// Connect to MongoDB Atlas Database
connectDB();

// Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Configuration for Vite Frontend & Deployed Origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging Middleware
if (process.env.NODE_ENV === 'development' || true) {
  app.use(morgan('dev'));
}

// Body Parsing & Cookie Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API Authentication & AI Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 InternConnect AI Authentication Server is live and healthy.',
    timestamp: new Date().toISOString(),
  });
});

// Serve Client Static Build Assets in Production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get(['/api', '/api/*'], (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Welcome to InternConnect AI API Backend',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      ai: '/api/ai'
    }
  });
});

// SPA Fallback Route for Client Side Routing
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).json({
        success: true,
        message: '🚀 InternConnect AI Backend API Server',
      });
    }
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`🚀 InternConnect AI Server running on PORT ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`==================================================\n`);
});
