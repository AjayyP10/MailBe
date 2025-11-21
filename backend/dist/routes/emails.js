"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("../../node_modules/.prisma/client/client");
const router = express_1.default.Router();
// @ts-ignore
const prisma = new client_1.PrismaClient();
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
exports.default = router;
//# sourceMappingURL=emails.js.map