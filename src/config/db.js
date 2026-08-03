const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  console.log('MongoDB connected successfully');
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
}

module.exports = { connectDB, getDB };