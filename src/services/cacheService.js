const { getDB } = require('../config/db');

const SIMILARITY_THRESHOLD = 0.5;

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(wordsA, wordsB) {
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  const intersection = new Set([...setA].filter((word) => setB.has(word)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

async function findCachedResponse(prompt) {
  const db = getDB();
  const cache = db.collection('promptCache');

  const cachedEntries = await cache.find({}).toArray();

  if (cachedEntries.length === 0) return null;

  const newWords = normalize(prompt);

  let bestMatch = null;
  let bestScore = 0;

  cachedEntries.forEach((entry) => {
    const entryWords = normalize(entry.prompt);
    const score = jaccardSimilarity(newWords, entryWords);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });

  if (bestScore >= SIMILARITY_THRESHOLD) {
    return { response: bestMatch.response, similarity: bestScore };
  }

  return null;
}

async function saveToCache(prompt, response) {
  const db = getDB();
  const cache = db.collection('promptCache');

  await cache.insertOne({
    prompt,
    response,
    createdAt: new Date(),
  });
}

module.exports = { findCachedResponse, saveToCache };