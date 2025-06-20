import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    text: "Xin chào! Tôi có thể giúp gì cho bạn về các chính sách và điều khoản thuê xe của chúng tôi?",
                    isUser: false,
                },
            ]);
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/chatbot/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: input }),
            });

            const data = await response.json();

            let botMessage = { text: "Xin lỗi, đã có lỗi xảy ra.", isUser: false };
            if (response.ok) {
                botMessage = { text: data.response || "Tôi chưa được huấn luyện về vấn đề này.", isUser: false };
            } else {
                botMessage = { text: data.error || "Không thể nhận được phản hồi.", isUser: false };
            }
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorMessage = { text: 'Không thể kết nối đến máy chủ chatbot.', isUser: false };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <button
                onClick={toggleChat}
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
                aria-label="Toggle Chat"
            >
                {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
            </button>

            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[450px] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-bold text-lg">Trợ lý ảo</h3>
                         <button
                            onClick={toggleChat}
                            className="text-white hover:text-gray-200"
                            aria-label="Close Chat"
                        >
                           <FiX size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`px-4 py-2 rounded-xl max-w-xs break-words ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                                    <span className="animate-pulse">Đang trả lời...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                placeholder="Nhập câu hỏi..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                className="ml-3 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={isLoading}
                            >
                                <FiSend size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
