const { checkRateLimit } = require('../services/rateLimitService');

async function rateLimit(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];

    const { allowed, remaining } = await checkRateLimit(apiKey);

    res.set('X-RateLimit-Remaining', remaining.toString());

    if (!allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please slow down.' });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = rateLimit;