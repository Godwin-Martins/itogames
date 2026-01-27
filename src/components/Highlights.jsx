import React from 'react';
import './Highlights.css';
import { FaPlus } from 'react-icons/fa';

const Highlights = () => {
    // Dummy data to simulate gamers' highlights
    const gamers = [
        { id: 1, name: 'SniperKing', game: 'CODM', img: 'https://placehold.co/100x100/00ff88/black?text=SK' },
        { id: 2, name: 'GoalMachine', game: 'eFootball', img: 'https://placehold.co/100x100/58a6ff/white?text=GM' },
        { id: 3, name: 'BushCamper', game: 'PUBGM', img: 'https://placehold.co/100x100/ffcc00/black?text=BC' },
        { id: 4, name: 'Slayer99', game: 'FreeFire', img: 'https://placehold.co/100x100/ff4444/white?text=S9' },
        { id: 5, name: 'DLS_Pro', game: 'DLS', img: 'https://placehold.co/100x100/aa00ff/white?text=DP' },
        { id: 6, name: 'SniperKing', game: 'CODM', img: 'https://placehold.co/100x100/00ff88/black?text=SK' },
        { id: 7, name: 'GoalMachine', game: 'eFootball', img: 'https://placehold.co/100x100/58a6ff/white?text=GM' },
        { id: 8, name: 'BushCamper', game: 'PUBGM', img: 'https://placehold.co/100x100/ffcc00/black?text=BC' },
        { id: 9, name: 'Slayer99', game: 'FreeFire', img: 'https://placehold.co/100x100/ff4444/white?text=S9' },
        { id: 10, name: 'DLS_Pro', game: 'DLS', img: 'https://placehold.co/100x100/aa00ff/white?text=DP' },
    ];

    return (
        <div className="highlights-container">
            {/* Create Highlight Button */}
            <div className="highlight-item">
                <div className="add-highlight">
                    <FaPlus />
                </div>
                <span>Your Clip</span>
            </div>

            {/* List of active highlights */}
            {gamers.map((gamer) => (
                <div key={gamer.id} className="highlight-item">
                    <div className="story-ring">
                        <img src={gamer.img} alt={gamer.name} />
                    </div>
                    <span>{gamer.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Highlights;