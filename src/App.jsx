import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Highlights from './components/Highlights';
import Feed from './components/Feed';
import CommunityPage from './pages/CommunityPage'; // Corrected path to pages folder

function App() {
  return (
    <Router>
      <div className="itogames-app">
        {/* Navigation Header */}
        <Header />

        <main className="main-content">
          <Routes>
            {/* Main Feed Route: / */}
            <Route path="/" element={
              <>
                {/* Horizontal Story Bar */}
                <section className="highlights-section">
                  <Highlights />
                </section>

                {/* Main Content Layout */}
                <div className="main-layout">
                  {/* Left Side: Scrolling Feed */}
                  <div className="feed-area">
                    <Feed />
                  </div>

                  {/* Right Side: Sticky Sidebar */}
                  <aside className="sidebar-area">
                    {/* Ongoing Tournaments Widget */}
                    <div className="sidebar-widget">
                      <h3>Ongoing Tournaments</h3>
                      <div className="tournament-card">
                        <p>eFootball Weekly Cup</p>
                        <span>Entry: $2.00</span>
                        <button className="join-btn">Join Now</button>
                      </div>
                    </div>

                    {/* RESTORED: Top Communities Widget */}
                    <div className="sidebar-widget">
                      <h3>Top Communities</h3>
                      <ul className="community-list">
                        <li>#PUBGM</li>
                        <li>#CODM</li>
                        <li>#eFootball</li>
                        <li>#FCMobile</li>
                        <li>#FreeFire</li>
                      </ul>
                    </div>
                  </aside>
                </div>
              </>
            } />

            {/* Community Routes: /communities */}
            <Route path="/communities" element={<CommunityPage />} />
            
            {/* Sub-route for groups: /communities/groups */}
            <Route path="/communities/groups" element={<CommunityPage showGroupsDirectly={true} />} />

            {/* Catch-all: Redirect invalid URLs back to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;