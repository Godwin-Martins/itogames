import React, { useState } from 'react';
import './Header.css';
import { 
    FaSearch, FaGamepad, FaTrophy, FaUserCircle, 
    FaBars, FaTimes, FaUsers, FaEnvelope, FaSignInAlt 
} from 'react-icons/fa';

const Header = () => {
    // Replace this with your actual Firebase auth logic later
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    return (
        <>
            <header className="it-header">
                <div className="header-container">
                    {/* Logo */}
                    <div className="logo">
                        <h1>iTo<span>games</span></h1>
                    </div>

                    {/* Search Bar - Hidden on small mobile */}
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search games, squads..." />
                    </div>

                    {/* Desktop Nav - Hidden on Mobile */}
                    <nav className="desktop-nav">
                        <button className="nav-item" title="Home"><FaGamepad /></button>
                        <button className="nav-item" title="Communities"><FaUsers /></button>
                        <button className="nav-item" title="Messages"><FaEnvelope /></button>
                        <button className="nav-item" title="Tournaments"><FaTrophy /></button>
                        
                        {isLoggedIn ? (
                            <button className="nav-item profile-btn">
                                <FaUserCircle /> <span>Profile</span>
                            </button>
                        ) : (
                            <button className="nav-item login-btn" onClick={() => setIsLoggedIn(true)}>
                                <FaSignInAlt /> <span>Sign In</span>
                            </button>
                        )}
                    </nav>

                    {/* Mobile Search Icon only (Top Right) */}
                    <div className="mobile-search-trigger">
                        <FaSearch />
                    </div>
                </div>
            </header>

            {/* FLOATING FOOTER FOR MOBILE */}
            <nav className="mobile-footer-nav">
                <a href="#home" className="footer-item active">
                    <FaGamepad />
                    <span>Home</span>
                </a>
                <a href="#communities" className="footer-item">
                    <FaUsers />
                    <span>Clubs</span>
                </a>
                <a href="#messages" className="footer-item">
                    <FaEnvelope />
                    <span>Chat</span>
                </a>
                <a href="#tournaments" className="footer-item">
                    <FaTrophy />
                    <span>Tours</span>
                </a>
                {isLoggedIn ? (
                    <a href="#profile" className="footer-item">
                        <FaUserCircle />
                        <span>Profile</span>
                    </a>
                ) : (
                    <a href="#login" className="footer-item sign-in-special">
                        <FaSignInAlt />
                        <span>Sign In</span>
                    </a>
                )}
            </nav>
        </>
    );
};

export default Header;