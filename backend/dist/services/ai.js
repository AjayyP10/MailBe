"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeAttachment = exports.scanForPhishing = exports.generateReply = void 0;
const axios_1 = __importDefault(require("axios"));
const generateReply = async (previousEmails, prompt) => {
    // Call OpenRouter API with Grok model
    const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'x-ai/grok-2-1212',
        messages: [{ role: 'user', content: `Based on these emails: ${previousEmails.join(' ')}, generate a reply for: ${prompt}` }]
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].message.content;
};
exports.generateReply = generateReply;
const scanForPhishing = async (emailBody) => {
    const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'x-ai/grok-2-1212',
        messages: [{ role: 'user', content: `Analyze this email for phishing: ${emailBody}. Return only one word: 'safe', 'potential scam', or 'scam'.` }]
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].message.content.trim().toLowerCase();
};
exports.scanForPhishing = scanForPhishing;
const summarizeAttachment = async (content) => {
    const response = await axios_1.default.post('https://api.x.ai/v1/chat/completions', {
        model: 'grok-4.1-fast',
        messages: [{ role: 'user', content: `Summarize this document: ${content}` }]
    }, {
        headers: { 'Authorization': `Bearer ${process.env.XAI_API_KEY}` }
    });
    return response.data.choices[0].message.content;
};
exports.summarizeAttachment = summarizeAttachment;
//# sourceMappingURL=ai.js.map