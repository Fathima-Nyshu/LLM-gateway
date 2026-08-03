const { findUserByApiKey } = require('../services/userService');

async function authenticate(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API key. Include it in the "x-api-key" header.' });
    }

    const user = await findUserByApiKey(apiKey);

    if (!user) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;