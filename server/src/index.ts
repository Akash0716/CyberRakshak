import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { app, initAppDB } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Client Production Build (Unified Full-Stack Deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

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

// Server startup
async function startServer() {
  await initAppDB();

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
