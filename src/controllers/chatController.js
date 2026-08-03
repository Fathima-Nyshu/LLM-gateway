const { callGroq } = require('../services/groqService');

async function handleChat(req, res, next) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A "prompt" string is required in the request body.' });
    }

    const responseText = await callGroq(prompt);

    res.json({ response: responseText });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };