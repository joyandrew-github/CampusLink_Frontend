import React, { useState } from 'react';
import { 
  MessageCircle,
  X,
  Send,
  Bot,
  User
} from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm CampusBot 🤖 How can I help you today?",
      sender: 'bot',
      time: '2:30 PM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    "What are today's announcements?",
    "How to report lost items?", 
    "Check hostel complaint status",
    "View my timetable"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Simulate bot response
    const botResponse = {
      id: messages.length + 2,
      text: getBotResponse(inputMessage),
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage, botResponse]);
    setInputMessage('');
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('announcement')) {
      return "📢 Today's announcements: Mid-Semester exams postponed, Tech Fest registration open, and Library hours extended. Would you like details on any specific one?";
    } else if (lowerMessage.includes('lost') || lowerMessage.includes('found')) {
      return "🔍 To report a lost item, go to Lost & Found section and click 'Report Lost Item'. Include details like item description, last seen location, and your contact info.";
    } else if (lowerMessage.includes('complaint') || lowerMessage.includes('hostel')) {
      return "🏠 You can check your complaint status in the Hostel Complaints section. Current average resolution time is 24-48 hours. Need help with a specific complaint?";
    } else if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule')) {
      return "📅 Your timetable shows classes from 9:00 AM to 4:30 PM today. You can edit or add new schedules in the Timetable section.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! 👋 I'm here to help you navigate CampusLink. Ask me about announcements, lost items, complaints, or your schedule!";
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('exchange')) {
      return "🎯 Skill Exchange lets you connect with peers! You can offer to teach skills or request to learn from others. Popular exchanges include coding, design, and language practice.";
    } else if (lowerMessage.includes('tech news') || lowerMessage.includes('opportunities')) {
      return "📰 Check out our Tech News section for the latest hackathons, internships, and startup opportunities. We update it daily with relevant opportunities for SECE students!";
    } else if (lowerMessage.includes('help')) {
      return "🆘 I can assist you with: \n• Campus announcements & updates\n• Lost & Found items\n• Hostel complaint tracking\n• Timetable management\n• Skill exchange connections\n• Tech opportunities\n\nWhat would you like to explore?";
    } else {
      return "I can help you with announcements, lost & found, hostel complaints, timetables, skill exchange, tech opportunities and more. What would you like to know about?";
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 relative"
          aria-label="Open chat"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6 group-hover:animate-bounce" />
          )}
          
          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          )}
          
          {/* Pulse Ring */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          )}
        </button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-slideUp">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">CampusBot</h3>
                <p className="text-sm text-white/80 flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors duration-200"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2 font-medium">Quick questions:</p>
              <div className="space-y-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatBot;