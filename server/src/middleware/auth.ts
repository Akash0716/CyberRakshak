import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface AuthenticatedUser {
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'administrator' | 'approver';
  department?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      success: false, 
      message: 'Access denied. No authentication token provided.' 
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired authentication session. Please log in again.' 
    });
  }
}

export function authorizeRoles(...allowedRoles: Array<'student' | 'administrator' | 'approver'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized. Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted. Your role '${req.user.role}' lacks permission for this operation.` 
      });
      return;
    }

    next();
  };
}

