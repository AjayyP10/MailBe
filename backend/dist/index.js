"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const client_1 = require("./generated/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const auth_1 = __importDefault(require("./routes/auth"));
const emails_1 = __importDefault(require("./routes/emails"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const connectionString = "postgresql://postgres:Pannicker@10@db.fjekymkvuuxokvkvwwek.supabase.co:5432/postgres";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
// @ts-ignore
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['error'],
});
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use('/auth', auth_1.default);
app.use('/emails', emails_1.default);
app.get('/', (req, res) => {
    res.send('MailBe Backend API');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map