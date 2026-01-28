import React, { useState } from 'react';
import './CommunityPage.css';
import { FaUsers, FaPlus, FaChevronLeft } from 'react-icons/fa';

const CommunityPage = () => {
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    // List of visible communities as agreed
    const communities = [
        { id: 'pubgm', name: 'PUBGM', icon: '🔫', color: '#ffcc00' },
        { id: 'codm', name: 'CODM', icon: '🎖️', color: '#58a6ff' },
        { id: 'efootball', name: 'eFootball', icon: '⚽', color: '#00ff88' },
        { id: 'fcmobile', name: 'FC Mobile', icon: '🎮', color: '#aa00ff' },
        { id: 'dls', name: 'DLS', icon: '🏆', color: '#ff4444' },
        { id: 'freefire', name: 'Free Fire', icon: '🔥', color: '#ffa500' }
    ];

    // Dummy groups for when a community is clicked
    const communityGroups = {
        pubgm: ["Global Warriors", "Sniper Squad", "Pushing Rank"],
        codm: ["Clan Warzone", "Legendary Only", "S&D Masters"],
        efootball: ["Online League", "Mobile Traders", "Friendly 1v1"],
        // ... more can be added here
    };

    const handleBack = () => setSelectedCommunity(null);

    return (
        <div className="community-page-container">
            {!selectedCommunity ? (
                <>
                    <div className="community-header">
                        <h2>Explore Communities</h2>
                        <p>Select a game to see its active groups</p>
                    </div>
                    <div className="communities-grid">
                        {communities.map((game) => (
                            <div 
                                key={game.id} 
                                className="community-card" 
                                onClick={() => setSelectedCommunity(game)}
                                style={{ '--hover-color': game.color }}
                            >
                                <div className="game-icon">{game.icon}</div>
                                <h3>{game.name}</h3>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="groups-view">
                    <button className="back-btn" onClick={handleBack}>
                        <FaChevronLeft /> Back to Communities
                    </button>
                    
                    <div className="group-header">
                        <h2>{selectedCommunity.name} Groups</h2>
                        {/* Users with 50+ followers will see this button active later */}
                        <button className="create-group-btn">
                            <FaPlus /> Create Group
                        </button>
                    </div>

                    <div className="groups-list">
                        {(communityGroups[selectedCommunity.id] || ["No groups found"]).map((group, index) => (
                            <div key={index} className="group-item">
                                <div className="group-info">
                                    <FaUsers className="group-icon-img" />
                                    <div>
                                        <h4>{group}</h4>
                                        <p>1.2k Members • Active Now</p>
                                    </div>
                                </div>
                                <button className="join-group-link">Join</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;