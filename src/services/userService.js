const { getDB } = require('../config/db');
const crypto = require('crypto');

function generateApiKey() {
  return 'sk_' + crypto.randomBytes(24).toString('hex');
}

async function createUser(email) {
  const db = getDB();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) {
    throw new Error('A user with this email already exists.');
  }

  const apiKey = generateApiKey();

  const newUser = {
    email,
    apiKey,
    createdAt: new Date(),
  };

  await users.insertOne(newUser);

  return { email, apiKey };
}

async function findUserByApiKey(apiKey) {
  const db = getDB();
  const users = db.collection('users');
  return users.findOne({ apiKey });
}

module.exports = { createUser, findUserByApiKey };