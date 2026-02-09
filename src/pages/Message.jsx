import React, { useState, useRef, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoClose, IoSearch, IoSend } from 'react-icons/io5';
import { BsThreeDotsVertical, BsCheckAll, BsPlus } from 'react-icons/bs';
import { MdVideoCall } from 'react-icons/md';
import { GrEmoji } from 'react-icons/gr';
import './Message.css';

const Message = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  const chats = [
    {
      id: 1,
      name: 'Fortune Huntsville',
      avatar: '👤',
      lastMessage: 'Cartoon keh Which one be dragon ball',
      time: '10:03',
      unread: 0
    },
    {
      id: 2,
      name: 'David (Doctor Strange)',
      avatar: '🧙',
      lastMessage: 'Ok',
      time: '09:08',
      unread: 0,
      active: true
    },
    {
      id: 3,
      name: 'Divine-Favour💕',
      avatar: '👤',
      lastMessage: 'Okay',
      time: '09:04',
      unread: 0
    },
    {
      id: 4,
      name: 'Temlio',
      avatar: '👥',
      lastMessage: 'Comlio Product',
      time: '08:50',
      unread: 0
    },
    {
      id: 5,
      name: 'TPG',
      avatar: '👤',
      lastMessage: 'THE PLUTO GAMERS💀👻🍆',
      time: '08:47',
      unread: 219
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'you',
      text: 'No',
      time: '09:04'
    },
    {
      id: 2,
      sender: 'other',
      text: 'The guy they kicked in the video\nThen he asked who kick me',
      time: '09:04'
    },
    {
      id: 3,
      sender: 'you',
      text: 'Oh',
      time: '09:05',
      read: true
    },
    {
      id: 4,
      sender: 'other',
      text: 'Have u watched rush hour',
      time: '09:05'
    },
    {
      id: 5,
      sender: 'you',
      text: 'No',
      time: '09:05',
      read: true
    },
    {
      id: 6,
      sender: 'you',
      text: 'Ok',
      time: '09:08'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="message-container">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Chats</h2>
          <div className="sidebar-header-actions">
            <button className="icon-btn">
              <BsPlus size={24} />
            </button>
            <button className="icon-btn">
              <BsThreeDotsVertical size={20} />
            </button>
            <button className="icon-btn close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="search-box">
          <IoSearch className="search-icon" />
          <input type="text" placeholder="Search or start a new chat" />
        </div>

        <div className="chat-tabs">
          <button className="chat-tab active">All</button>
          <button className="chat-tab">Unread</button>
          <button className="chat-tab">Favourites</button>
          <button className="chat-tab">Groups</button>
        </div>

        <div className="chat-list">
          {chats.map((chat) => (
            <div key={chat.id} className={`chat-item ${chat.active ? 'active' : ''}`}>
              <div className="chat-avatar">{chat.avatar}</div>
              <div className="chat-info">
                <div className="chat-header">
                  <h4>{chat.name}</h4>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <p className="chat-message">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Sticky Header */}
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <HiMenuAlt3 size={24} />
          </button>
          <div className="header-user-info">
            <div className="header-avatar">🧙</div>
            <h3>David (Doctor Strange)</h3>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <MdVideoCall size={24} />
            </button>
            <button className="icon-btn">
              <IoSearch size={20} />
            </button>
            <button className="icon-btn">
              <BsThreeDotsVertical size={20} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === 'you' ? 'message-sent' : 'message-received'}`}>
              {msg.sender === 'other' && <div className="message-sender">David (Doctor Strange)</div>}
              <div className="message-bubble">
                <p>{msg.text}</p>
                <div className="message-meta">
                  <span className="message-time">{msg.time}</span>
                  {msg.sender === 'you' && msg.read && <BsCheckAll className="read-receipt" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Message Input */}
        <div className="message-input-container">
          <button className="icon-btn">
            <BsPlus size={28} />
          </button>
          <button className="icon-btn">
            <GrEmoji size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="icon-btn send-btn" onClick={handleSendMessage}>
            <IoSend size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Message;