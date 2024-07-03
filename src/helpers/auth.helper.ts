import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';

const SECRET = process.env.TOKEN_KEY as Secret;

export const generateToken = (user: Pick<User, 'id' | 'username'>) => {
  return jwt.sign({ user }, SECRET);
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const token = req.headers.authorization.split(' ')?.[1];
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    res.status(401);
    res.json('Invalid token');
  }
};
