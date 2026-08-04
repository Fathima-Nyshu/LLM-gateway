const { callGroq } = require('../services/groqService');
const { logUsage } = require('../services/usageService');

async function handleChat(req, res, next) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A "prompt" string is required in the request body.' });
    }

    const responseText = await callGroq(prompt);

    const apiKey = req.headers['x-api-key'];
    await logUsage({ apiKey, prompt, response: responseText });

    res.json({ response: responseText });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };