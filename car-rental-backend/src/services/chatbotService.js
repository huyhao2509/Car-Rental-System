const { spawn } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const REQUEST_TIMEOUT_MS = 30000;

class ChatbotService {
    constructor() {
        const scriptPath = path.join(__dirname, '..', 'chatbot', 'chatbot.py');
        // Note: In production, ensure 'python' is in the system's PATH.
        // You might need to use 'python3' or a virtual environment's Python executable.
        this.pythonProcess = spawn('python', [scriptPath]);
        this.pendingRequests = new Map();
        this.stdoutBuffer = '';
        this.stderrBuffer = '';

        this.pythonProcess.stdout.on('data', (data) => {
            this.processBufferedLines('stdoutBuffer', data, (line) => this.handlePythonResponse(line));
        });

        this.pythonProcess.stderr.on('data', (data) => {
            this.processBufferedLines('stderrBuffer', data, (line) => this.logPythonStderr(line));
        });

        this.pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            this.rejectAllPendingRequests(new Error('Python chatbot process has stopped.'));
            // Implement restart logic if needed
        });

        console.log('Chatbot service initialized and Python script started.');
    }

    ask(query) {
        return new Promise((resolve, reject) => {
            const requestId = uuidv4();
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error('Chatbot response timeout.'));
            }, REQUEST_TIMEOUT_MS);

            this.pendingRequests.set(requestId, { resolve, reject, timeoutId });

            try {
                this.sendRequest(requestId, query);
            } catch (error) {
                clearTimeout(timeoutId);
                console.error('Error writing to Python script stdin:', error);
                this.pendingRequests.delete(requestId);
                reject(error);
            }
        });
    }

    processBufferedLines(bufferName, data, handleLine) {
        this[bufferName] += data.toString();
        const lines = this[bufferName].split('\n');
        this[bufferName] = lines.pop() || '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                handleLine(trimmedLine);
            }
        }
    }

    sendRequest(requestId, query) {
        if (!this.pythonProcess || !this.pythonProcess.stdin.writable) {
            throw new Error('Python chatbot process is not available.');
        }

        const request = {
            id: requestId,
            query,
        };

        this.pythonProcess.stdin.write(`${JSON.stringify(request)}\n`);
    }

    handlePythonResponse(line) {
        try {
            const parsed = JSON.parse(line);
            if (!parsed.id || !this.pendingRequests.has(parsed.id)) {
                return;
            }

            const request = this.pendingRequests.get(parsed.id);
            clearTimeout(request.timeoutId);
            request.resolve(parsed);
            this.pendingRequests.delete(parsed.id);
        } catch (error) {
            console.error('Error parsing JSON from Python script:', error, 'Raw line:', line);
        }
    }

    logPythonStderr(line) {
        if (line.includes(' - INFO - ')) {
            console.log(`Python script info: ${line}`);
            return;
        }

        if (line.includes(' - WARNING - ')) {
            console.warn(`Python script warning: ${line}`);
            return;
        }

        console.error(`Python script error: ${line}`);
    }

    rejectAllPendingRequests(error) {
        for (const [requestId, request] of this.pendingRequests) {
            clearTimeout(request.timeoutId);
            request.reject(error);
            this.pendingRequests.delete(requestId);
        }
    }
}

// Export a singleton instance
const chatbotService = new ChatbotService();
module.exports = chatbotService;
