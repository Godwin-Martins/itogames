import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUserPlus, FaCheck, FaArrowRight } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followingStates, setFollowingStates] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            setError('Please sign in to view notifications.');
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', auth.currentUser.uid);
        
        // Real-time listener for notifications
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const notifs = data.notifications || [];
                    const following = data.following || [];
                setNotifications(notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                
                // Initialize following states for each notification
                const states = {};
                notifs.forEach(notif => {
                        states[notif.followerId] = following.includes(notif.followerId);
                });
                setFollowingStates(states);
            }
            setLoading(false);
        }, (err) => {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications.');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFollowBack = async (followerId) => {
        if (!auth.currentUser) return alert('Please sign in to follow gamers!');
        if (auth.currentUser.uid === followerId) return alert("You can't follow yourself!");

        try {
            const currentUserRef = doc(db, 'users', auth.currentUser.uid);
            const followerRef = doc(db, 'users', followerId);

            // onSnapshot is local-first: the SDK applies the write to its
            // local cache and fires the callback immediately, so followingStates
            // updates the instant updateDoc is called — no manual setState needed.

            if (!followingStates[followerId]) {
                // --- Follow ---
                await updateDoc(currentUserRef, {
                    following: arrayUnion(followerId)
                });
                await updateDoc(followerRef, {
                    followersCount: increment(1)
                });
            } else {
                // --- Unfollow ---
                await updateDoc(currentUserRef, {
                    following: arrayRemove(followerId)
                });
                await updateDoc(followerRef, {
                    followersCount: increment(-1)
                });
            }
        } catch (err) {
            console.error('Follow error:', err);
            alert('Action failed. Check your connection.');
        }
    };

    const handleViewProfile = (followerId) => {
        navigate(`/user/${followerId}`);
    };

    if (loading) return <div className="notifications-status">Loading notifications...</div>;
    if (error) return <div className="notifications-status error">{error}</div>;

    if (notifications.length === 0) {
        return (
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                </div>
                <div className="empty-notifications">
                    <FaUserCircle className="empty-icon" />
                    <p>No notifications yet</p>
                    <span>When someone follows you, they'll appear here</span>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h1>Notifications</h1>
                <span className="notification-count">{notifications.length}</span>
            </div>

            <div className="notifications-list">
                {notifications.map((notification, idx) => (
                    <div key={idx} className="notification-item">
                        <div className="notification-content">
                            <div className="notification-avatar">
                                {notification.followerPhoto ? (
                                    <img 
                                        src={notification.followerPhoto} 
                                        alt={notification.followerName}
                                        className="avatar-img"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <FaUserCircle className="avatar-icon" />
                                )}
                            </div>

                            <div className="notification-text">
                                <div className="notification-message">
                                    <strong>{notification.followerName}</strong>
                                    <span> started following you</span>
                                </div>
                                <div className="notification-username">
                                    @{notification.followerUsername}
                                </div>
                                <div className="notification-time">
                                    {new Date(notification.timestamp).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="notification-actions">
                            <button
                                className={`follow-back-btn ${followingStates[notification.followerId] ? 'following' : ''}`}
                                onClick={() => handleFollowBack(notification.followerId)}
                            >
                                {followingStates[notification.followerId] ? (
                                    <><FaCheck /> Unfollow</>
                                ) : (
                                    <><FaUserPlus /> Follow Back</>
                                )}
                            </button>

                            <button
                                className="view-profile-btn"
                                onClick={() => handleViewProfile(notification.followerId)}
                                title="View profile"
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;