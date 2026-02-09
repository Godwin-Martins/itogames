import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FaUserCircle, FaTrophy, FaImages, FaThList } from 'react-icons/fa';
import { getGameLogo } from '../utils/gameLogos';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        gameTag: '',
        bio: '',
        photoURL: '',
    });
    const [saveState, setSaveState] = useState({ saving: false, error: null, success: false });

    useEffect(() => {
        // Essential: Use onAuthStateChanged to wait for Firebase to initialize the user
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        setFormData({
                            fullName: data.fullName || '',
                            username: data.username || '',
                            gameTag: data.gameTag || '',
                            bio: data.bio || '',
                            photoURL: data.photoURL || '',
                        });
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

    const handleEditToggle = () => {
        setSaveState({ saving: false, error: null, success: false });
        setIsEditing((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!auth.currentUser) {
            setSaveState({ saving: false, error: 'No authenticated user found.', success: false });
            return;
        }

        setSaveState({ saving: true, error: null, success: false });
        try {
            const docRef = doc(db, "users", auth.currentUser.uid);
            const payload = {
                fullName: formData.fullName.trim(),
                username: formData.username.trim(),
                gameTag: formData.gameTag.trim(),
                bio: formData.bio.trim(),
                photoURL: formData.photoURL.trim(),
            };

            await updateDoc(docRef, payload);
            setUserData((prev) => ({ ...prev, ...payload }));
            setIsEditing(false);
            setSaveState({ saving: false, error: null, success: true });
        } catch (err) {
            console.error("Update error:", err);
            setSaveState({ saving: false, error: 'Failed to update profile.', success: false });
        }
    };

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
                        {isEditing ? (
                            <div className="profile-edit-fields">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                />
                                <input
                                    type="text"
                                    name="gameTag"
                                    value={formData.gameTag}
                                    onChange={handleChange}
                                    placeholder="Game tag"
                                />
                            </div>
                        ) : (
                            <>
                                <h1>{userData.fullName}</h1>
                                <p className="username">@{userData.username}</p>
                                <span className="game-tag">{userData.gameTag || "New Player"}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-value">{userData.followersCount || 0}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    {isEditing ? (
                        <div className="edit-actions">
                            <button
                                className="edit-profile-btn"
                                onClick={handleSave}
                                disabled={saveState.saving}
                            >
                                {saveState.saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="edit-profile-btn" onClick={handleEditToggle}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button className="edit-profile-btn" onClick={handleEditToggle}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="profile-edit-extras">
                    <div className="profile-edit-row">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell people about your playstyle..."
                            rows={3}
                        />
                    </div>
                    <div className="profile-edit-row">
                        <label htmlFor="photoURL">Photo URL</label>
                        <input
                            id="photoURL"
                            type="text"
                            name="photoURL"
                            value={formData.photoURL}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>
                    {saveState.error && <div className="profile-status-screen error">{saveState.error}</div>}
                    {saveState.success && <div className="profile-status-screen">Profile updated.</div>}
                </div>
            )}

            {/* Communities Section */}
            {userData.communities && (
                <div className="profile-communities">
                    {userData.communities.map((game) => (
                        <div key={game} className="community-logo-wrapper" title={game}>
                            <img src={getGameLogo(game)} alt={game} className="community-logo" />
                        </div>
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
