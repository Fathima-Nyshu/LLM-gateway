const express = require('express');
const { handleChat } = require('../controllers/chatController');
const authenticate = require('../middleware/authMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');
const checkQuota = require('../middleware/quotaMiddleware');

const router = express.Router();

router.post('/chat', authenticate, rateLimit, checkQuota, handleChat);

module.exports = router;