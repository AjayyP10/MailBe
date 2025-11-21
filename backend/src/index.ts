import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';
import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import authRoutes, { initializeAuth } from './routes/auth';
import emailsRoutes from './routes/emails';

dotenv.config();

// Initialize authentication strategies after environment variables are loaded
initializeAuth();

const app = express();

const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
// @ts-ignore
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/emails', emailsRoutes);

app.get('/', (req, res) => {
  res.send('MailBe Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});