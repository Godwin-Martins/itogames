import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle, Trash2, Clock, Send } from 'lucide-react';
import './Message.css';

const Message = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const updateChatMessages = (chatId, messages) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, messages } : chat
    ));
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(chats.length > 1 ? chats.find(chat => chat.id !== chatId)?.id : null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const currentChat = chats.find(chat => chat.id === activeChat);
    if (!currentChat) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentChat.messages, userMessage];
    updateChatMessages(activeChat, updatedMessages);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Thanks for your message. How can I help you?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updateChatMessages(activeChat, [...updatedMessages, aiMessage]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentChat = chats.find(chat => chat.id === activeChat);

  return (
    <div className="message-app">
      <header className="message-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <h1 className="message-title">Messages</h1>
        <div className="header-spacer"></div>
      </header>

      <div className="message-main-content">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 80 }}
            >
              <aside className="message-sidebar" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  className="new-chat-btn"
                  onClick={createNewChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  New Chat
                </motion.button>

                <div className="recent-chats">
                  <h3>
                    <Clock size={16} />
                    Recent Chats
                  </h3>
                  
                  {chats.length === 0 ? (
                    <p className="no-chats">No recent chats</p>
                  ) : (
                    <div className="chat-list">
                      {chats.map((chat, index) => (
                        <motion.div
                          key={chat.id}
                          className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                          onClick={() => setActiveChat(chat.id)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <MessageCircle size={16} />
                          <span className="chat-title">
                            {chat.title || 'New Chat'}
                          </span>
                          <span className="chat-date">
                            {formatDate(chat.createdAt)}
                          </span>
                          <motion.button
                            className="delete-chat-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            whileHover={{ scale: 1.2 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={activeChat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="chat-area-wrapper"
          onClick={() => setIsSidebarOpen(false)}
        >
          {!currentChat ? (
            <div className="message-chat-area empty">
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <MessageCircle size={64} className="empty-icon" />
                <h2>Messages</h2>
                <p>Start a new conversation</p>
                <motion.button 
                  className="start-chat-btn" 
                  onClick={createNewChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  Start New Chat
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <div className="message-chat-area">
              <div className="messages-container">
                <AnimatePresence>
                  {currentChat.messages.length === 0 ? (
                    <motion.div 
                      key="empty-chat"
                      className="empty-chat"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <MessageCircle size={48} />
                      <h3>How can I help you today?</h3>
                    </motion.div>
                  ) : (
                    currentChat.messages.map(msg => (
                      <motion.div
                        key={msg.id}
                        className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="message-avatar">
                          <span>{msg.sender === 'user' ? '👤' : '🤖'}</span>
                        </div>
                        <div className="message-content">
                          <div className="message-text">
                            <p>{msg.text}</p>
                          </div>
                          <div className="message-time">{msg.time}</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="input-container">
                <div className="input-wrapper">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                  />
                  
                  <motion.button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="send-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Message;