const express = require('express');
const { askQuestion } = require('../controllers/chatbotController');

const router = express.Router();

router.post('/ask', askQuestion);

module.exports = router;
