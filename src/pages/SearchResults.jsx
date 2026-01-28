import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { getGameLogo } from '../utils/gameLogos';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (searchParams.get('q')) {
            performSearch(searchParams.get('q'));
        }
    }, [searchParams]);

    const performSearch = async (query) => {
    if (!query.trim()) {
        setError('Please enter a search term');
        return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
        console.log("Searching for:", query);
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        const searchLower = query.toLowerCase().trim();
        const filteredResults = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Search by username OR full name
            const username = data.username?.toLowerCase() || "";
            const fullName = data.fullName?.toLowerCase() || "";
            
            if (username.includes(searchLower) || fullName.includes(searchLower)) {
                filteredResults.push({ id: doc.id, ...data });
            }
        });

        setResults(filteredResults);
        console.log("Results found:", filteredResults.length);

    } catch (err) {
        console.error("Search Error Detail:", err);
        // This will now tell you if it's a Permission or Network error
        setError(`Search failed: ${err.message}`); 
    } finally {
        setLoading(false);
    }
};

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch(searchQuery);
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div className="search-results-container">
            <div className="search-results-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <FaArrowLeft /> Back
                </button>
                <h1>Search Users</h1>
            </div>

            <form onSubmit={handleSearch} className="search-results-form">
                <div className="search-input-group">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <button type="submit">Search</button>
                </div>
            </form>

            <div className="search-results-content">
                {loading && <div className="loading">Searching...</div>}

                {error && searched && (
                    <div className="no-results">{error}</div>
                )}

                {!loading && results.length > 0 && (
                    <div className="results-list">
                        <p className="results-count">Found {results.length} user{results.length !== 1 ? 's' : ''}</p>
                        {results.map((user) => (
                            <div
                                key={user.id}
                                className="user-card"
                                onClick={() => handleUserClick(user.id)}
                            >
                                {user.photoURL && (
                                    <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                                )}
                                <div className="user-info">
                                    <h3 className="username">@{user.username}</h3>
                                    <p className="display-name">{user.displayName}</p>
                                    {user.communities && user.communities.length > 0 && (
                                        <div className="user-communities">
                                            {user.communities.slice(0, 2).map((game) => (
                                                <div key={game} className="community-logo-wrapper">
                                                    <img src={getGameLogo(game)} alt={game} className="community-logo" title={game} />
                                                </div>
                                            ))}
                                            {user.communities.length > 2 && (
                                                <span className="community-tag">
                                                    +{user.communities.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {user.followersCount && (
                                    <div className="user-stats">
                                        <p>{user.followersCount} Followers</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !searched && (
                    <div className="initial-state">
                        <FaSearch className="initial-icon" />
                        <p>Start searching for users by their username</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
