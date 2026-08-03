const express = require('express');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1', chatRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`LLM Gateway running on port ${PORT}`);
});