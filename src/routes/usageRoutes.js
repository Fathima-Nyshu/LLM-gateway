const express = require('express');
const { handleGetUsage } = require('../controllers/usageController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/usage', authenticate, handleGetUsage);

module.exports = router;