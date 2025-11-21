"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_microsoft_1 = require("passport-microsoft");
const client_1 = require("../generated/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
// @ts-ignore
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['error'],
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({ where: { providerId: profile.id } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    provider: 'google',
                    providerId: profile.id,
                    accessToken,
                    refreshToken
                }
            });
        }
        else {
            await prisma.user.update({
                where: { id: user.id },
                data: { accessToken, refreshToken }
            });
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport_1.default.use(new passport_microsoft_1.Strategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: '/auth/microsoft/callback',
    scope: ['user.read', 'mail.read']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({ where: { providerId: profile.id } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    provider: 'microsoft',
                    providerId: profile.id,
                    accessToken,
                    refreshToken
                }
            });
        }
        else {
            await prisma.user.update({
                where: { id: user.id },
                data: { accessToken, refreshToken }
            });
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport_1.default.serializeUser((user, done) => done(null, user.id));
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = jsonwebtoken_1.default.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
});
router.get('/microsoft', passport_1.default.authenticate('microsoft'));
router.get('/microsoft/callback', passport_1.default.authenticate('microsoft', { failureRedirect: '/' }), (req, res) => {
    const token = jsonwebtoken_1.default.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
});
exports.default = router;
//# sourceMappingURL=auth.js.map