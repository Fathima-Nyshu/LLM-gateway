const { getDB } = require('../config/db');

const COST_PER_1K_TOKENS = 0.0002;

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function calculateCost(tokens) {
  return (tokens / 1000) * COST_PER_1K_TOKENS;
}

async function logUsage({ apiKey, prompt, response }) {
  const db = getDB();
  const usageLogs = db.collection('usageLogs');

  const promptTokens = estimateTokens(prompt);
  const responseTokens = estimateTokens(response);
  const totalTokens = promptTokens + responseTokens;
  const cost = calculateCost(totalTokens);

  const logEntry = {
    apiKey,
    promptTokens,
    responseTokens,
    totalTokens,
    cost,
    timestamp: new Date(),
  };

  await usageLogs.insertOne(logEntry);

  return logEntry;
}

async function getUsageSummary(apiKey) {
  const db = getDB();
  const usageLogs = db.collection('usageLogs');

  const logs = await usageLogs.find({ apiKey }).toArray();

  const totalRequests = logs.length;
  const totalTokens = logs.reduce((sum, log) => sum + log.totalTokens, 0);
  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);

  return { totalRequests, totalTokens, totalCost, logs };
}

async function getMonthlyRequestCount(apiKey) {
  const db = getDB();
  const usageLogs = db.collection('usageLogs');

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await usageLogs.countDocuments({
    apiKey,
    timestamp: { $gte: startOfMonth },
  });

  return count;
}

module.exports = { logUsage, estimateTokens, calculateCost, getUsageSummary, getMonthlyRequestCount };