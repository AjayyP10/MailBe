import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
// @ts-ignore
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};