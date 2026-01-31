import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import socket from '../hooks/useSocket';

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      socket.emit('user-join', {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      });
    }

    socket.on('chat-history', (history) => {
      setMessages(history);
    });

    socket.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('users-online', (users) => {
      setOnlineUsers(users);
    });

    socket.on('user-typing', ({ user: typingUser, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (!prev.find((u) => u.user_id === typingUser.user_id)) {
            return [...prev, typingUser];
          }
          return prev;
        } else {
          return prev.filter((u) => u.user_id !== typingUser.user_id);
        }
      });
    });

    return () => {
      socket.off('chat-history');
      socket.off('new-message');
      socket.off('users-online');
      socket.off('user-typing');
    };
  }, [user]);

  const handleTyping = () => {
    socket.emit('typing', true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('chat-message', { content: input.trim() });
    socket.emit('typing', false);
    setInput('');
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-700 border-red-300',
      employee: 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Team Chat</h1>
                <p className="text-white/70 text-sm">{onlineUsers.length} online</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-220px)] min-h-[500px]">
          {/* Online Users Sidebar */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Online Users</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {onlineUsers.map((u) => (
                <div
                  key={u.user_id}
                  className={`flex items-center gap-2 p-2 rounded-lg min-w-max lg:min-w-0 ${
                    u.user_id === user?.user_id ? 'bg-emerald-100' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {u.first_name?.[0]}{u.last_name?.[0]}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {u.first_name} {u.last_name?.[0]}.
                      {u.user_id === user?.user_id && <span className="text-gray-500"> (You)</span>}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <span className="text-4xl mb-2 block">👋</span>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.user_id === user?.user_id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : ''}`}>
                        {!isOwnMessage && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {msg.first_name?.[0]}{msg.last_name?.[0]}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {msg.first_name} {msg.last_name}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded border ${getRoleBadge(msg.role)}`}>
                              {msg.role}
                            </span>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-emerald-600 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span>
                    {typingUsers.map((u) => u.first_name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Send</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
