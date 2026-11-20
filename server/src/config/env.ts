import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberrakshak',
  JWT_SECRET: process.env.JWT_SECRET || 'cyberrakshak_campus_trustdesk_jwt_secret_key_2026',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};

