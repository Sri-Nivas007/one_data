import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetimagesBYid, ToggleLike, ToggleFollow } from "../api/api";

import "../styles/pinDetail.css";

// Define interfaces for PostData and User
interface User {
    _id: string;
    name: string;
    email: string;
    followers: string[]; // Assuming followers is an array of user IDs
}

interface PostData {
    _id: string;
    imageUrl: string;
    title: string;
    description: string;
    tags: string;
    likesCount: number;
    isLiked: boolean;
    user: User;
    comments: string[]; // Assuming comments is an array of comment strings
    isFollow: boolean;
}

const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    console.log("id", id);
    const [postData, setPostData] = useState<PostData | null>(null);
    const [liked, setLiked] = useState<boolean>(false);
    const [isFollow, setIsFollow] = useState<boolean>(false); // Track follow status
    const [followersCount, setFollowersCount] = useState<number>(0); // Track followers count
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Track logged-in user ID

    useEffect(() => {
        // Retrieve currentUserId from localStorage
        const currentUserId = localStorage.getItem("id");
        setCurrentUserId(currentUserId); // Set current user ID from localStorage

        const fetchImageDetails = async () => {
            try {
                const response = await GetimagesBYid(id!);
                if (response.data && response.data.data) {
                    setPostData(response.data.data);
                    setLiked(response.data.data.isLiked); // Set initial like state
                    setIsFollow(response.data.data.isFollow); // Set initial follow state
                    setFollowersCount(response.data.data.user.followers.length); // Initialize followers count
                } else {
                    console.log("No data found");
                }
            } catch (error) {
                console.error("Error fetching image details:", error);
            }
        };

        if (id) {
            fetchImageDetails();
        }
    }, [id]);

    const toggleLike = async () => {
        try {
            const response = await ToggleLike(id!);

            setPostData((prev: PostData | null) =>
                prev
                    ? {
                          ...prev,
                          likesCount: response.data.likesCount,
                      }
                    : prev
            );
            setLiked(!liked); // Toggle like state
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const toggleFollow = async () => {
        // Ensure that postData and currentUserId are available
        if (!postData || !currentUserId) return;

        try {
            // API call to follow/unfollow the target user
            const response = await ToggleFollow(postData.user._id);
            // Assuming the API returns the updated followers count
            const updatedFollowersCount = response.data.followersCount;

            // Update the followers count in state immediately
            setFollowersCount(updatedFollowersCount);

            // Toggle the follow status
            setIsFollow(!isFollow);
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    if (!postData) {
        return <p>Loading...</p>;
    }

    // Extract the first letter of the user's name
    const firstLetter = postData.user?.name
        ? postData.user.name.charAt(0).toUpperCase()
        : "";

    return (
        <div className="detail-container">
            {/* Left Section: Image */}
            <div className="image-section">
                <img
                    src={postData.imageUrl}
                    alt="Detail"
                    className="detail-image"
                />
            </div>

            {/* Right Section: Content */}
            <div className="content-section">
                <div className="user-info">
                    <div className="user-details">
                        {/* Rounded div with first letter */}
                        <div className="user-profile-image">{firstLetter}</div>
                        <div>
                            <p className="user-name">{postData.user?.name}</p>
                            <p className="user-email">{postData.user?.email}</p>
                            <p className="followers">
                                {followersCount} followers
                            </p>
                        </div>
                    </div>

                    <button
                        className={`follow-button ${
                            isFollow ? "following" : "follow"
                        }`}
                        onClick={toggleFollow}
                        disabled={currentUserId === postData.user._id} // Disable button if following self
                    >
                        {isFollow ? "Following" : "Follow"}
                    </button>
                </div>

                <div className="action-buttons">
                    <button
                        className={`like-button ${liked ? "active" : ""}`}
                        onClick={toggleLike}
                    >
                        {liked ? "❤️ Liked" : "🤍 Like"}
                    </button>
                </div>

                <div className="post-stats">
                    <p>
                        {liked ? postData.likesCount : postData.likesCount}{" "}
                        likes
                    </p>
                    <p>
                        {postData.comments ? postData.comments.length : 0}{" "}
                        comments
                    </p>
                </div>

                <div className="post-details">
                    {/* Display title and description */}
                    <h3>{postData.title}</h3>
                    <p>{postData.description}</p>

                    {/* Display tags with # */}
                    <p>
                        {postData.tags
                            ?.split(" ")
                            .map((tag: string, index: number) => (
                                <span key={index} className="tag">
                                    #{tag}{" "}
                                </span>
                            ))}
                    </p>
                </div>

                <div className="comment-box">
                    <input
                        type="text"
                        placeholder="Add a comment"
                        className="comment-input"
                    />
                    <div className="comment-icons">
                        <span>😊</span>
                        <span>📷</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
