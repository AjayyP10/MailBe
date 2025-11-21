import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';
import { PrismaClient } from './generated/client';
import authRoutes from './routes/auth';
import emailsRoutes from './routes/emails';

dotenv.config();

const app = express();
// @ts-ignore
const prisma = new PrismaClient();
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