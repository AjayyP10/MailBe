import express from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { PrismaClient } from '../../node_modules/.prisma/client/client';

const router = express.Router();
// @ts-ignore
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const emails = await prisma.email.findMany({
      where: { userId: req.user!.id },
      include: { attachments: true }
    });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  // Send email logic here
  res.json({ message: 'Email sent' });
});

export default router;