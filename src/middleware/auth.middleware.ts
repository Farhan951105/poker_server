import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export interface AuthRequest extends Request { user?: any }

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization?.split(' ')[1];
  if (!bearer) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET!) as { id: number };
    req.user = await User.findByPk(decoded.id);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};
