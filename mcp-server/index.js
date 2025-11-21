const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.post('/search', async (req, res) => {
  const { query, userToken } = req.body;
  // Mock search in Google Drive, OneDrive, etc.
  // For now, return mock data
  res.json({ results: [`Found document related to "${query}"`] });
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});