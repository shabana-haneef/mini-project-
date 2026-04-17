const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../controllers/aiChatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, generateChatResponse);

module.exports = router;
