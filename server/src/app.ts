import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

export const app = express();

// Ensure DB is initialized
let dbConnected = false;
export async function initAppDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

// Global Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory
const uploadsDir = path.resolve(process.cwd(), 'server/uploads');
app.use('/uploads', express.static(uploadsDir));

// Health & Status
app.get(['/api/health', '/.netlify/functions/api/health'], (req, res) => {
  res.json({
    status: 'healthy',
    system: 'CyberRakshak 3.0 – Campus TrustDesk',
    institution: 'Vishnu Institute of Technology, Bhimavaram',
    timestamp: new Date().toISOString()
  });
});

// Sub-router for all API endpoints
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/notices', noticeRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/incidents', incidentRoutes);
apiRouter.use('/learning', learningRoutes);
apiRouter.use('/demo', demoRoutes);

// Mount under both standard /api and Netlify Functions path
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

