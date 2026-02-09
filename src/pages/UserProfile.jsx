import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FaUserCircle, FaTrophy, FaImages, FaThList, FaUserPlus, FaEnvelope, FaCheck } from 'react-icons/fa';
import { getGameLogo } from '../utils/gameLogos';
import './Profile.css';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'users', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    setError('User profile not found.');
                }
            } catch (err) {
                console.error('User fetch error:', err);
                setError('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    // Check if current user is already following this user
    useEffect(() => {
        if (!auth.currentUser || !id) return;

        const checkFollowing = async () => {
            try {
                const currentUserRef = doc(db, 'users', auth.currentUser.uid);
                const currentUserData = (await getDoc(currentUserRef)).data();
                const following = currentUserData?.following || [];
                setIsFollowing(following.includes(id));
            } catch (err) {
                console.error('Error checking follow status:', err);
            }
        };

        checkFollowing();
    }, [id]);

    const handleFollow = async () => {
        if (!auth.currentUser) return alert("Please sign in to follow gamers!");
        if (auth.currentUser.uid === id) return alert("You can't follow yourself!");

        setFollowLoading(true);
        try {
            const userRef = doc(db, 'users', id);
            const currentUserRef = doc(db, 'users', auth.currentUser.uid);
            const currentUserSnap = await getDoc(currentUserRef);
            const currentUserData = currentUserSnap.data();
            
            // Check the actual following list from the database to prevent duplicate follows
            const followingList = currentUserData?.following || [];
            const isActuallyFollowing = followingList.includes(id);

            if (!isActuallyFollowing) {
                // Follow the user
                await updateDoc(currentUserRef, {
                    following: arrayUnion(id)
                });

                await updateDoc(userRef, {
                    followersCount: increment(1),
                    notifications: arrayUnion({
                        followerId: auth.currentUser.uid,
                        followerName: currentUserData?.fullName || 'User',
                        followerUsername: currentUserData?.username || 'user',
                        followerPhoto: currentUserData?.photoURL || null,
                        timestamp: new Date().toISOString(),
                        isFollowed: false
                    })
                });

                // Update local UI
                setUserData(prev => ({ ...prev, followersCount: (prev.followersCount || 0) + 1 }));
                setIsFollowing(true);
            } else {
                // Unfollow the user
                await updateDoc(currentUserRef, {
                    following: arrayRemove(id)
                });

                await updateDoc(userRef, {
                    followersCount: increment(-1)
                });

                // Update local UI
                setUserData(prev => ({ ...prev, followersCount: Math.max(0, (prev.followersCount || 0) - 1) }));
                setIsFollowing(false);
            }
        } catch (err) {
            console.error("Follow error:", err);
            alert("Action failed. Check your connection.");
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return <div className="profile-status-screen">Loading User Profile...</div>;
    if (error) return <div className="profile-status-screen error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info-main">
                    <div className="profile-pic-container">
                        {userData.photoURL ? (
                            <img 
                                src={userData.photoURL} 
                                alt="Gamer" 
                                className="profile-img-actual" 
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <FaUserCircle className="default-avatar" />
                        )}
                    </div>
                    <div className="profile-names">
                        <h1>{userData.fullName}</h1>
                        <p className="username">@{userData.username}</p>
                        <span className="game-tag">{userData.gameTag || 'Gamer'}</span>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-value">{userData.followersCount || 0}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    
                    <div className="profile-actions">
                        <button 
                            className={`follow-btn ${isFollowing ? 'following' : ''}`} 
                            onClick={handleFollow}
                            disabled={followLoading}
                        >
                            {isFollowing ? <><FaCheck /> Unfollow</> : <><FaUserPlus /> Follow</>}
                        </button>
                        
                        <button className="message-btn" onClick={() => navigate(`/messages/${id}`)}>
                            <FaEnvelope /> Message
                        </button>
                    </div>
                </div>
            </div>

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
                <button className='tab active'><FaThList /> Posts</button>
                <button className='tab'><FaTrophy /> Achievements</button>
                <button className='tab'><FaImages /> Media</button>
            </div>

            <div className="profile-content">
                <div className="empty-state">No public posts from this gamer yet.</div>
            </div>
        </div>
    );
};

export default UserProfile;