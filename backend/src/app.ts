import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { config } from './config/env.js';

export const createApp = () => {
  const app = express();

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Allow Monaco Editor and inline preview
    crossOriginEmbedderPolicy: false,
  }));

  // CORS Configuration
  app.use(
    cors({
      origin: [config.frontendOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Request Parsers
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Global Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again later.' },
  });
  app.use('/api', limiter);

  // Mount API Routes
  app.use('/api', routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Application Error:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      error: config.nodeEnv === 'development' ? err.stack : undefined,
    });
  });

  return app;
};
