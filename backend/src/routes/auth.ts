import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const router = express.Router();

const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
// @ts-ignore
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

// Initialize OAuth strategies after environment variables are loaded
const initializeAuth = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
  }, async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
    try {
      let user = await prisma.user.findUnique({ where: { providerId: profile.id } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails![0].value,
            name: profile.displayName,
            provider: 'google',
            providerId: profile.id,
            accessToken,
            refreshToken
          }
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { accessToken, refreshToken }
        });
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }));

  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    callbackURL: '/auth/microsoft/callback',
    scope: ['user.read', 'mail.read']
  }, async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
    try {
      let user = await prisma.user.findUnique({ where: { providerId: profile.id } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails![0].value,
            name: profile.displayName,
            provider: 'microsoft',
            providerId: profile.id,
            accessToken,
            refreshToken
          }
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { accessToken, refreshToken }
        });
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }));
};

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET!);
  res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
});

router.get('/microsoft', passport.authenticate('microsoft'));
router.get('/microsoft/callback', passport.authenticate('microsoft', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET!);
  res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
});

export { initializeAuth };
export default router;