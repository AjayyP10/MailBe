import axios from 'axios';

export const generateReply = async (previousEmails: string[], prompt: string) => {
  // Call OpenRouter API with Grok model
  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
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

export const scanForPhishing = async (emailBody: string) => {
  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
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

export const summarizeAttachment = async (content: string) => {
  const response = await axios.post('https://api.x.ai/v1/chat/completions', {
    model: 'grok-4.1-fast',
    messages: [{ role: 'user', content: `Summarize this document: ${content}` }]
  }, {
    headers: { 'Authorization': `Bearer ${process.env.XAI_API_KEY}` }
  });
  return response.data.choices[0].message.content;
};