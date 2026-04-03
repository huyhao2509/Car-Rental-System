const chatbotService = require('../services/chatbotService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler } = require('../middlewares/errorHandler');

const askQuestion = asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return ResponseUtil.error(res, 'Question is required.', 400);
    }

    const response = await chatbotService.ask(question);
    return res.json(response);
});

module.exports = {
    askQuestion,
};
