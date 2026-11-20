import mongoose from 'mongoose';
import { ENV } from './env.js';
import { memoryDb } from '../services/memoryDbFallback.js';

let isUsingFallback = false;

export function isUsingFallbackDB(): boolean {
  return isUsingFallback;
}

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', false);
    // Attempt to connect to MongoDB with a short timeout
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 1000
    });
    console.log(`🚀 Connected to MongoDB at: ${ENV.MONGODB_URI}`);
    isUsingFallback = false;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection unavailable (${error.message || 'connection failed'}).`);
    console.warn('🔄 Switching seamlessly to CyberRakshak In-Memory Campus Database fallback.');
    isUsingFallback = true;
    await memoryDb.init();
  }
}
