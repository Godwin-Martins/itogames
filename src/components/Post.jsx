import React, { useState } from 'react';
import './Post.css';
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaCopy, FaGamepad } from 'react-icons/fa';

const Post = ({ post }) => {
    const [liked, setLiked] = useState(false);

    const copyGameID = (id) => {
        navigator.clipboard.writeText(id);
        alert("Game ID Copied!");
    };

    return (
        <div className="post-card">
            {/* Post Header: User Info + Game ID */}
            <div className="post-header">
                <div className="user-info">
                    <img src={post.userImg} alt={post.username} className="user-avatar" />
                    <div>
                        <h4 className="username">{post.username}</h4>
                        <p className="timestamp">{post.time}</p>
                    </div>
                </div>
                {/* The Game ID Tag we talked about */}
                <div className="game-id-badge" onClick={() => copyGameID(post.gameID)}>
                    <FaGamepad className="id-icon" />
                    <span>{post.gameID}</span>
                    <FaCopy className="copy-icon" />
                </div>
            </div>

            {/* Post Content: Image or Video */}
            <div className="post-content">
                <p className="post-caption">{post.caption}</p>
                {post.type === 'video' ? (
                    <video controls className="post-media">
                        <source src={post.mediaUrl} type="video/mp4" />
                    </video>
                ) : (
                    <img src={post.mediaUrl} alt="post" className="post-media" />
                )}
            </div>

            {/* Post Interactions */}
            <div className="post-actions">
                <div className="action-group">
                    <button onClick={() => setLiked(!liked)} className={liked ? "liked" : ""}>
                        {liked ? <FaHeart /> : <FaRegHeart />} <span>{liked ? post.likes + 1 : post.likes}</span>
                    </button>
                    <button><FaRegComment /> <span>{post.comments}</span></button>
                    <button><FaShare /> <span>Share</span></button>
                </div>
                {/* Community Tag */}
                <div className="post-community-tag">
                    #{post.community}
                </div>
            </div>
        </div>
    );
};

export default Post;