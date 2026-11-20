import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory (for sample receipts, attachments)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Client Production Build (Unified Full-Stack Deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'CyberRakshak 3.0 – Campus TrustDesk',
    institution: 'Vishnu Institute of Technology, Bhimavaram',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/demo', demoRoutes);

// SPA client fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) next();
  });
});

// Global Error Handler
app.use(errorHandler);

// Server startup
async function startServer() {
  await connectDB();

  app.listen(Number(ENV.PORT), '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🛡️  CYBERRAKSHAK 3.0 – CAMPUS TRUSTDESK API RUNNING`);
    console.log(`🏛️  Vishnu Institute of Technology, Bhimavaram`);
    console.log(`📡  Listening on: http://localhost:${ENV.PORT}`);
    console.log(`🧪  Live Evaluation Demo: http://localhost:${ENV.PORT}/api/demo/demo-1-genuine`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Fatal Server Boot Error:', err);
});
