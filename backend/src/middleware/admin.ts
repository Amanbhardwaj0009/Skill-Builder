import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'administrator') {
    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    return;
  }

  next();
};
