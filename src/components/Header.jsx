import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { 
    FaSearch, FaGamepad, FaTrophy, FaUserCircle, 
    FaUsers, FaEnvelope, FaSignInAlt, FaBell 
} from 'react-icons/fa';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                // Set up real-time listener for notifications
                const userRef = doc(db, 'users', currentUser.uid);
                const notificationUnsubscribe = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const notifications = docSnap.data().notifications || [];
                        setNotificationCount(notifications.length);
                    } else {
                        setNotificationCount(0);
                    }
                });

                return () => notificationUnsubscribe();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
            setSearchInput('');
        }
    };

    const handleMobileSearchClick = () => {
        navigate('/search');
    };

    return (
        <>
            <header className="it-header">
                <div className="header-container">
                    {/* Logo - Text decoration removed via CSS logo-link class */}
                    <Link to="/" className="logo-link">
                        <div className="logo">
                            <img src="/logo.png" alt="itodux logo" className="logo-img" />
                            <h1>ito<span>dux</span></h1>
                        </div>
                    </Link>

                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
                            <input 
                                type="text" 
                                placeholder="Search users by username..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </form>
                    </div>

                    <nav className="desktop-nav">
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <FaGamepad />
                        </NavLink>

                        <NavLink to="/communities" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <FaUsers />
                        </NavLink>

                        <button className="nav-item" onClick={() => {
                            if (!auth.currentUser) return navigate('/login');
                            navigate('/messages');
                        }}><FaEnvelope /></button>
                        
                        <button className="nav-item notification-btn" onClick={() => {
                            if (!auth.currentUser) return navigate('/login');
                            navigate('/notifications');
                        }}>
                            <FaBell />
                            {notificationCount > 0 && (
                                <span className="notification-badge">{notificationCount}</span>
                            )}
                        </button>
                        
                        <button className="nav-item"><FaTrophy /></button>
                        
                        {!loading && (
                            user ? (
                                <button onClick={handleProfileClick} className="profile-btn">
                                    <FaUserCircle />
                                    <span>Profile</span>
                                </button>
                            ) : (
                                <Link to="/login" className="nav-item login-btn">
                                    <FaSignInAlt /> <span>Sign In</span>
                                </Link>
                            )
                        )}
                    </nav>

                    {/* Mobile Notification & Search Icons (Top Right) */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="mobile-notification-btn" onClick={() => {
                            if (!auth.currentUser) return navigate('/login');
                            navigate('/notifications');
                        }}>
                            <FaBell />
                            {notificationCount > 0 && (
                                <span className="notification-badge">{notificationCount}</span>
                            )}
                        </button>
                        <div className="mobile-search-trigger" onClick={handleMobileSearchClick}>
                            <FaSearch />
                        </div>
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
                <div className="footer-item" onClick={() => {
                    if (!auth.currentUser) return navigate('/login');
                    navigate('/messages');
                }}><FaEnvelope /><span>Chat</span></div>
                <div className="footer-item"><FaTrophy /><span>Tours</span></div>
                {!loading && (
                    user ? (
                        <button onClick={handleProfileClick} className="footer-item profile-footer">
                            <FaUserCircle />
                            <span>Profile</span>
                        </button>
                    ) : (
                        <Link to="/login" className="footer-item sign-in-special">
                            <FaSignInAlt />
                            <span>Sign In</span>
                        </Link>
                    )
                )}
            </nav>
        </>
    );
};

export default Header;