"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("../generated/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const ai_1 = require("../services/ai");
const router = express_1.default.Router();
const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
// @ts-ignore
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['error'],
});
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const emails = await prisma.email.findMany({
            where: { userId: req.user.id },
            include: { attachments: true }
        });
        res.json(emails);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    // Send email logic here
    res.json({ message: 'Email sent' });
});
router.post('/generate-reply', auth_1.authenticateToken, async (req, res) => {
    try {
        const { emailId, prompt } = req.body;
        // Get the email and related conversation
        const email = await prisma.email.findUnique({
            where: { id: emailId, userId: req.user.id },
            include: { attachments: true }
        });
        if (!email) {
            return res.status(404).json({ error: 'Email not found' });
        }
        // Get previous emails in the thread (simplified - in real app would need thread detection)
        const previousEmails = [email.body];
        const reply = await (0, ai_1.generateReply)(previousEmails, prompt);
        res.json({ reply });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate reply' });
    }
});
router.post('/scan-phishing/:emailId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { emailId } = req.params;
        const email = await prisma.email.findUnique({
            where: { id: emailId, userId: req.user.id }
        });
        if (!email) {
            return res.status(404).json({ error: 'Email not found' });
        }
        const result = await (0, ai_1.scanForPhishing)(email.body);
        // Update email category based on scan result
        let category = 'Inbox';
        if (result.toLowerCase().includes('scam')) {
            category = 'Scam';
        }
        else if (result.toLowerCase().includes('potential')) {
            category = 'Potential Scam';
        }
        else if (result.toLowerCase().includes('promotional')) {
            category = 'Promotional';
        }
        await prisma.email.update({
            where: { id: emailId },
            data: { category }
        });
        res.json({ result, category });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to scan for phishing' });
    }
});
exports.default = router;
//# sourceMappingURL=emails.js.map