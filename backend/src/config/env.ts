import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'skillquest_super_secret_jwt_key_fallback_2026',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  llm: {
    provider: process.env.LLM_PROVIDER || 'gemini',
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || 'gemini-1.5-flash',
    baseUrl: process.env.LLM_BASE_URL || '',
  },
  codeExecTimeoutMs: parseInt(process.env.CODE_EXEC_TIMEOUT_MS || '3000', 10),
};
