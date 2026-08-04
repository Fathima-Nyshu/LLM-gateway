const express = require('express');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const usageRoutes = require('./routes/usageRoutes');
const cors = require('cors');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1', userRoutes);
app.use('/v1', chatRoutes);
app.use('/v1', usageRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`LLM Gateway running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();