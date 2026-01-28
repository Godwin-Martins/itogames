import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FaUserCircle, FaTrophy, FaImages, FaThList } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Essential: Use onAuthStateChanged to wait for Firebase to initialize the user
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setError("User profile data not found in database.");
                    }
                } catch (err) {
                    console.error("Fetch error:", err);
                    setError("Failed to load profile data.");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("No user is signed in.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="profile-status-screen">Loading Gamer Profile...</div>;
    if (error) return <div className="profile-status-screen error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info-main">
                    <div className="profile-pic-container">
                        {/* Display Google Photo if available, else default icon */}
                        {userData.photoURL ? (
                            <img 
                                src={userData.photoURL} 
                                alt="Profile" 
                                className="profile-img-actual" 
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <FaUserCircle className="default-avatar" />
                        )}
                        <button className="edit-pic-btn">+</button>
                    </div>
                    <div className="profile-names">
                        <h1>{userData.fullName}</h1>
                        <p className="username">@{userData.username}</p>
                        <span className="game-tag">{userData.gameTag || "New Player"}</span>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-value">{userData.followersCount || 0}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <button className="edit-profile-btn">Edit Profile</button>
                </div>
            </div>

            {/* Communities Section */}
            {userData.communities && (
                <div className="profile-communities">
                    {userData.communities.map((game) => (
                        <span key={game} className="community-badge">#{game}</span>
                    ))}
                </div>
            )}

            <div className="profile-tabs">
                <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>
                    <FaThList /> Posts
                </button>
                <button className={activeTab === 'achievements' ? 'active' : ''} onClick={() => setActiveTab('achievements')}>
                    <FaTrophy /> Achievements
                </button>
                <button className={activeTab === 'media' ? 'active' : ''} onClick={() => setActiveTab('media')}>
                    <FaImages /> Media
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'posts' && <div className="empty-state">No posts yet. Start sharing your gameplay!</div>}
                {activeTab === 'achievements' && (
                    <div className="achievements-grid">
                        <div className="achievement-card lock">
                            <FaTrophy />
                            <p>First Tournament Win</p>
                            <span>Locked</span>
                        </div>
                    </div>
                )}
                {activeTab === 'media' && <div className="empty-state">No media uploaded.</div>}
            </div>
        </div>
    );
};

export default Profile;