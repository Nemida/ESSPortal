import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello${user?.first_name ? `, ${user.first_name}` : ''}! 👋 I'm your AI HR Assistant. I can help you with:\n\n• Leave requests and form submissions\n• IT support queries\n• Company announcements and events\n• HR policies and procedures\n\nHow can I assist you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick action suggestions
  const quickActions = [
    { label: 'Apply for Leave', prompt: 'How do I apply for annual leave?' },
    { label: 'IT Support', prompt: 'I need help with an IT issue' },
    { label: 'Upcoming Events', prompt: 'What events are coming up?' },
    { label: 'Announcements', prompt: 'What are the latest announcements?' },
    { label: 'Available Forms', prompt: 'What forms are available on the portal?' },
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      setIsStreaming(true);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: fullResponse,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback to non-streaming
      try {
        const res = await api.post('/api/ai/chat', {
          message: input.trim(),
          conversationHistory,
        });
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: res.data.response,
          };
          return newMessages;
        });
      } catch (fallbackErr) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again later.',
          };
          return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! How can I help you, ${user?.first_name || 'there'}?`
    }]);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-120px)] min-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">AI HR Assistant</h1>
              <p className="text-white/70 text-sm">Powered by Llama 3 (Free Tier)</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-white/70 hover:text-white text-sm px-3 py-1 rounded-md hover:bg-white/10 transition"
          >
            Clear Chat
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 bg-gray-50 border-b overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.prompt)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">🤖</span>
                    <span className="text-xs font-medium text-indigo-600">AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                  {isStreaming && idx === messages.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-indigo-600 animate-pulse ml-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about HR, forms, or policies..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are generated based on portal data. For official policies, please consult HR.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;