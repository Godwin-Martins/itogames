import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';
import { 
    FaSearch, FaGamepad, FaTrophy, FaUserCircle, 
    FaUsers, FaEnvelope, FaSignInAlt 
} from 'react-icons/fa';

const Header = () => {
    return (
        <>
            <header className="it-header">
                <div className="header-container">
                    {/* Logo - Text decoration removed via CSS logo-link class */}
                    <Link to="/" className="logo-link">
                        <div className="logo">
                            <h1>iTo<span>games</span></h1>
                        </div>
                    </Link>

                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search games, squads..." />
                    </div>

                    <nav className="desktop-nav">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <FaGamepad />
                        </NavLink>

                        <NavLink to="/communities" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <FaUsers />
                        </NavLink>

                        <button className="nav-item"><FaEnvelope /></button>
                        <button className="nav-item"><FaTrophy /></button>
                        <button className="nav-item login-btn">
                            <FaSignInAlt /> <span>Sign In</span>
                        </button>
                    </nav>

                    {/* Restored Mobile Search Icon (Top Right) */}
                    <div className="mobile-search-trigger">
                        <FaSearch />
                    </div>
                </div>
            </header>

            {/* FLOATING FOOTER */}
            <nav className="mobile-footer-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? "footer-item active" : "footer-item"}>
                    <FaGamepad />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/communities" className={({ isActive }) => isActive ? "footer-item active" : "footer-item"}>
                    <FaUsers />
                    <span>Clubs</span>
                </NavLink>
                <div className="footer-item"><FaEnvelope /><span>Chat</span></div>
                <div className="footer-item"><FaTrophy /><span>Tours</span></div>
                <div className="footer-item"><FaUserCircle /><span>Sign In</span></div>
            </nav>
        </>
    );
};

export default Header;