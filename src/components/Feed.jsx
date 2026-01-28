import React from 'react';
import Post from './Post';

const Feed = () => {
    // Mock data for initial UI build
    const posts = [
        {
            id: 1,
            username: "Ghost_Sniper",
            userImg: "https://placehold.co/100x100/333/fff?text=GS",
            time: "2h ago",
            gameID: "558299103",
            caption: "New world record in CODM? Check this out! #SniperKing",
            type: "image",
            mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZiQO_8lDmfbHgB_gsDeBXi8XI8HYXH8nD9g&s",
            likes: 124,
            comments: 45,
            community: "CODM"
        },
        {
            id: 2,
            username: "FC_God",
            userImg: "https://placehold.co/100x100/444/fff?text=FC",
            time: "5h ago",
            gameID: "ID: 990112",
            caption: "Rate this goal from 1-10! ⚽",
            type: "video",
            mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder video
            likes: 89,
            comments: 12,
            community: "FC Mobile"
        }
    ];

    return (
        <div className="feed-wrapper">
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;