const { spawn } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ChatbotService {
  constructor() {
    const scriptPath = path.join(__dirname, '..', 'chatbot', 'chatbot.py');
    // Note: In production, ensure 'python' is in the system's PATH.
    // You might need to use 'python3' or a virtual environment's Python executable.
    this.pythonProcess = spawn('python', [scriptPath]);
    this.pendingRequests = new Map();

    this.pythonProcess.stdout.on('data', (data) => {
      const responses = data.toString().split('\n').filter(line => line.trim() !== '');
      responses.forEach(response => {
        try {
          const parsed = JSON.parse(response);
          if (parsed.id && this.pendingRequests.has(parsed.id)) {
            const resolver = this.pendingRequests.get(parsed.id);
            resolver(parsed);
            this.pendingRequests.delete(parsed.id);
          }
        } catch (error) {
          console.error('Error parsing JSON from Python script:', error);
        }
      });
    });

    this.pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    this.pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      // Implement restart logic if needed
    });

    console.log('Chatbot service initialized and Python script started.');
  }

  ask(query) {
    return new Promise((resolve, reject) => {
      const requestId = uuidv4();
      this.pendingRequests.set(requestId, resolve);

      const request = {
        id: requestId,
        query: query,
      };

      try {
        this.pythonProcess.stdin.write(JSON.stringify(request) + '\n');
      } catch (error) {
        console.error('Error writing to Python script stdin:', error);
        this.pendingRequests.delete(requestId);
        reject(error);
      }
    });
  }
}

// Export a singleton instance
const chatbotService = new ChatbotService();
module.exports = chatbotService; 
