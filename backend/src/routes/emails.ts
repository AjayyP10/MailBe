import express from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { generateReply, scanForPhishing } from '../services/ai';

const router = express.Router();

const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
// @ts-ignore
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

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

router.post('/generate-reply', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { emailId, prompt } = req.body;

    // Get the email and related conversation
    const email = await prisma.email.findUnique({
      where: { id: emailId, userId: req.user!.id },
      include: { attachments: true }
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Get previous emails in the thread (simplified - in real app would need thread detection)
    const previousEmails = [email.body];

    const reply = await generateReply(previousEmails, prompt);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate reply' });
  }
});

router.post('/scan-phishing/:emailId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { emailId } = req.params;

    const email = await prisma.email.findUnique({
      where: { id: emailId, userId: req.user!.id }
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const result = await scanForPhishing(email.body);

    // Update email category based on scan result
    let category = 'Inbox';
    if (result.toLowerCase().includes('scam')) {
      category = 'Scam';
    } else if (result.toLowerCase().includes('potential')) {
      category = 'Potential Scam';
    } else if (result.toLowerCase().includes('promotional')) {
      category = 'Promotional';
    }

    await prisma.email.update({
      where: { id: emailId },
      data: { category }
    });

    res.json({ result, category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan for phishing' });
  }
});

export default router;