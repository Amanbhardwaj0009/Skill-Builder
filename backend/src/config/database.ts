import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import { config } from './env.js';

let mongod: MongoMemoryServer | null = null;

export const connectDatabase = async (): Promise<string> => {
  if (mongoose.connection.readyState === 1) {
    return 'Already connected';
  }

  let uri = config.mongodbUri;

  if (uri) {
    try {
      console.log(`[DB] Attempting connection to MongoDB at: ${uri.replace(/:[^:]*@/, ':****@')}`);
      await mongoose.connect(uri);
      console.log('✅ [DB] Connected successfully to configured MongoDB');
      return uri;
    } catch (err) {
      console.warn('⚠️ [DB] Failed to connect to configured MongoDB URI, falling back to embedded in-memory MongoDB...', err);
    }
  }

  // Fallback to MongoMemoryServer for standalone out-of-the-box operation
  console.log('🚀 [DB] Initializing embedded in-memory MongoDB server...');

  // Automatically check for local cached binaries
  const possiblePaths = [
    path.resolve(process.cwd(), 'mongodb-binaries/mongod-x64-win32-7.0.24.exe'),
    path.resolve(process.cwd(), '../mongodb-binaries/mongod-x64-win32-7.0.24.exe'),
    'C:/Users/bhard/OneDrive/Desktop/Antigravity/mongodb-binaries/mongod-x64-win32-7.0.24.exe',
  ];

  for (const binPath of possiblePaths) {
    if (fs.existsSync(binPath)) {
      process.env.MONGOMS_SYSTEM_BINARY = binPath;
      break;
    }
  }

  mongod = await MongoMemoryServer.create({
    binary: process.env.MONGOMS_SYSTEM_BINARY
      ? { systemBinary: process.env.MONGOMS_SYSTEM_BINARY }
      : undefined,
  });
  uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`✅ [DB] Connected to embedded in-memory MongoDB: ${uri}`);
  return uri;
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
