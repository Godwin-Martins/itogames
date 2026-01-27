import React from 'react';
import './App.css';
import Header from './components/Header';
import Highlights from './components/Highlights';
import Feed from './components/Feed';

function App() {
  return (
    <div className="itogames-app">
      {/* 1. Top Navigation */}
      <Header />

      <main className="main-content">
        
        {/* 2. Horizontal Story Bar (2min Clips) */}
        <section className="highlights-section">
           <Highlights />
        </section>

        {/* 3. Main Content Layout */}
        <div className="main-layout">
          
          {/* Left Side: The Scrolling Feed */}
          <div className="feed-area">
            <Feed />
          </div>

          {/* Right Side: Tournaments & Communities Sidebar */}
          <aside className="sidebar-area">
            {/* We'll build this component next */}
            <div className="sidebar-widget">
                <h3>Ongoing Tournaments</h3>
                <div className="tournament-card">
                    <p>eFootball Weekly Cup</p>
                    <span>Entry: $2.00</span>
                    <button className="join-btn">Join Now</button>
                </div>
            </div>

            <div className="sidebar-widget">
                <h3>Top Communities</h3>
                <ul className="community-list">
                    <li>#CODM</li>
                    <li>#FCMobile</li>
                    <li>#FreeFire</li>
                    <li>#PUBGM</li>
                </ul>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default App;