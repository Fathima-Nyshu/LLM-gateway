const express = require('express');
const { handleChat } = require('../controllers/chatController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/chat', authenticate, handleChat);

module.exports = router;