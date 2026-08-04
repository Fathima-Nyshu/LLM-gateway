const { callGroq } = require('../services/groqService');
const { logUsage } = require('../services/usageService');
const { findCachedResponse, saveToCache } = require('../services/cacheService');

async function handleChat(req, res, next) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A "prompt" string is required in the request body.' });
    }

    const apiKey = req.headers['x-api-key'];

    const cached = await findCachedResponse(prompt);

    if (cached) {
      return res.json({ response: cached.response, cached: true, similarity: cached.similarity });
    }

    const responseText = await callGroq(prompt);

    await logUsage({ apiKey, prompt, response: responseText });
    await saveToCache(prompt, responseText);

    res.json({ response: responseText, cached: false });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };