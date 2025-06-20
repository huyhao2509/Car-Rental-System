const chatbotService = require('../services/chatbotService');

const askQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const response = await chatbotService.ask(question);
    res.json(response);
  } catch (error) {
    console.error('Error getting response from chatbot service:', error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};

module.exports = {
  askQuestion,
}; 
