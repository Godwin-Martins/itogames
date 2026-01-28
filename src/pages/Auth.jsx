import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { FaGoogle, FaCheckCircle, FaUser, FaCalendarAlt } from 'react-icons/fa';

// Firebase imports
import { auth, db } from '../firebase'; 
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Auth = () => {
    const navigate = useNavigate();
    
    // UI Logic States
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // User Data States
    const [tempUser, setTempUser] = useState(null); 
    const [formData, setFormData] = useState({
        username: '',
        age: '',
        communities: []
    });

    const games = ["PUBGM", "CODM", "eFootball", "FC Mobile", "DLS", "Free Fire"];

    // 1. Google Sign In Handler
    const handleGoogleSignIn = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Check if user is actually new to the app
            const details = getAdditionalUserInfo(result);

            if (details?.isNewUser) {
                setTempUser(user);
                setShowSetupModal(true);
            } else {
                // If not "new" by Auth standards, check if Firestore record exists
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    navigate('/profile');
                } else {
                    setTempUser(user);
                    setShowSetupModal(true);
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Google Sign In failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCommunityChange = (game) => {
        setFormData(prev => ({
            ...prev,
            communities: prev.communities.includes(game)
                ? prev.communities.filter(g => g !== game)
                : [...prev.communities, game]
        }));
    };

    // 2. Finalize Profile & Save to Firestore
    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.communities.length === 0) {
            alert("Please pick at least one game!");
            return;
        }

        setLoading(true);
        try {
            console.log("Saving profile for UID:", tempUser.uid);

            const userRef = doc(db, "users", tempUser.uid);
            const profileData = {
                uid: tempUser.uid,
                fullName: tempUser.displayName,
                email: tempUser.email,
                photoURL: tempUser.photoURL,
                username: formData.username.toLowerCase().trim(),
                age: formData.age,
                communities: formData.communities,
                followersCount: 0,
                gameTag: `${formData.username.trim()}#itodux`,
                createdAt: new Date(),
                setupComplete: true
            };

            await setDoc(userRef, profileData);
            
            // If we reach here, save was successful
            setShowSetupModal(false); 
            setShowSuccessModal(true); 

        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Could not save profile. Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Initial Login Screen */}
            {!showSetupModal && !showSuccessModal && (
                <div className="auth-card">
                    <h1>ito<span>dux</span></h1>
                    <h2>Gamer Entrance</h2>
                    <p>Sign in with Google to start your journey.</p>
                    <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                        <FaGoogle /> {loading ? "Connecting..." : "Continue with Google"}
                    </button>
                </div>
            )}

            {/* MANDATORY SETUP MODAL - Cannot be canceled */}
            {showSetupModal && (
                <div className="modal-overlay no-cancel">
                    <div className="setup-modal">
                        <h2>Create Your Profile</h2>
                        <p>One last step before you enter the arena.</p>
                        
                        <form onSubmit={handleSetupSubmit}>
                            <div className="input-group">
                                <FaUser className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Gamer Username" 
                                    required 
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>

                            <div className="input-group">
                                <FaCalendarAlt className="input-icon" />
                                <input 
                                    type="number" 
                                    placeholder="Age" 
                                    required 
                                    value={formData.age}
                                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                                />
                            </div>

                            <div className="community-selection">
                                <label>Select Your Games:</label>
                                <div className="games-grid">
                                    {games.map(game => (
                                        <div 
                                            key={game} 
                                            className={`game-chip ${formData.communities.includes(game) ? 'selected' : ''}`}
                                            onClick={() => handleCommunityChange(game)}
                                        >
                                            {game}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="auth-btn" disabled={loading}>
                                {loading ? "Saving Profile..." : "Finish Setup"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <FaCheckCircle className="success-icon" />
                        <h2>Profile Ready!</h2>
                        <p>Welcome to itodux, {formData.username}.</p>
                        <button onClick={() => navigate('/profile')} className="continue-btn">
                            Enter Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;