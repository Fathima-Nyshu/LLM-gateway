const { getMonthlyRequestCount } = require('../services/usageService');

async function checkQuota(req, res, next) {
  try {
    const user = req.user;

    const requestCount = await getMonthlyRequestCount(user.apiKey);

    if (requestCount >= user.monthlyQuota) {
      return res.status(429).json({
        error: `Monthly quota exceeded. You've used ${requestCount} of ${user.monthlyQuota} allowed requests this month.`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = checkQuota;