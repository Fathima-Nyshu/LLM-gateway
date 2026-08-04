const { callGroq } = require('../services/groqService');
const { callOpenRouter } = require('../services/openrouterService');
const { logUsage } = require('../services/usageService');
const { findCachedResponse, saveToCache } = require('../services/cacheService');

async function getAIResponse(prompt) {
  try {
    const response = await callGroq(prompt);
    return { response, provider: 'groq' };
  } catch (error) {
    console.error('Groq failed, falling back to OpenRouter:', error.message);
    const response = await callOpenRouter(prompt);
    return { response, provider: 'openrouter' };
  }
}

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

    const { response: responseText, provider } = await getAIResponse(prompt);

    await logUsage({ apiKey, prompt, response: responseText });
    await saveToCache(prompt, responseText);

    res.json({ response: responseText, cached: false, provider });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };