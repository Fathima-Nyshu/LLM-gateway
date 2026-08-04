const { getUsageSummary } = require('../services/usageService');

async function handleGetUsage(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    const summary = await getUsageSummary(apiKey);
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

module.exports = { handleGetUsage };