import React, { useState, useEffect } from "react";

import { Getprofile, ToggleFollow } from "../api/api";
import { Link } from "react-router-dom";
import "../styles/profilePage.css";

// Define types for the follower, following, and likedPin
interface User {
    _id: string;
    name: string;
    profile_image?: string;
}

interface LikedPin {
    pinId: string;
    imageUrl: string;
}

const ProfilePage: React.FC = () => {
    const [userName, setUserName] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>("");
    const [followers, setFollowers] = useState<User[]>([]); // Specify the type for followers
    const [followings, setFollowings] = useState<User[]>([]); // Specify the type for followings
    const [likedPins, setLikedPins] = useState<LikedPin[]>([]); // Specify the type for liked pins
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("followers");

    // Fetch profile data
    const fetchProfileData = async () => {
        try {
            const response = await Getprofile();
            if (response.status === 200) {
                const data = response.data;
                setUserName(data.name);
                setProfileImage(data.profile_image);
                setFollowers(data.followers);
                setFollowings(data.followings);
                setLikedPins(data.liked_pins);
            } else {
                console.error(
                    "Error fetching profile data:",
                    response.data.message
                );
            }
        } catch (error) {
            console.log("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle follow/unfollow API call
    const handleFollowToggle = async (
        id: string,
        action: "follow" | "unfollow"
    ) => {
        try {
            const response = await ToggleFollow(id);
            if (response.status === 200) {
                fetchProfileData();
            }
        } catch (error) {
            console.error(`Error while trying to ${action}:`, error);
        }
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the token from localStorage
        window.location.href = "/login"; // Redirect to login page
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    return (
        <div className="profile-container">
            <h1>Profile Detail</h1>
            <div className="profile-header">
                <div className="profile-image">
                    {loading ? (
                        <div className="profile-placeholder">Loading...</div>
                    ) : (
                        <div className="profile-avatar">
                            {profileImage ? profileImage : "U"}
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <h1>{userName}</h1>
                    <div className="profile-follow">
                        <span>{followers.length} Followers</span>
                        <span>{followings.length} Following</span>
                    </div>
                    <button className="edit-profile-btn">Edit Profile</button>
                </div>
            </div>

            {/* Logout Button */}
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>

            <div className="tabs">
                <button
                    className={`tab-btn ${
                        activeTab === "followers" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("followers")}
                >
                    Followers
                </button>
                <button
                    className={`tab-btn ${
                        activeTab === "following" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("following")}
                >
                    Following
                </button>
                <button
                    className={`tab-btn ${
                        activeTab === "likedPins" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("likedPins")}
                >
                    Liked Pins
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "followers" && (
                    <div className="tab-panel">
                        <h3>Followers</h3>
                        {followers.length === 0 ? (
                            <p>No followers yet.</p>
                        ) : (
                            <ul className="responsive-list">
                                {followers.map((follower, index) => (
                                    <li key={index} className="list-item">
                                        <div className="profile-item">
                                            <div className="profile-avatar">
                                                {follower.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="profile-details">
                                                <span>{follower.name}</span>
                                            </div>
                                            <button
                                                className="follow-btn"
                                                onClick={() =>
                                                    handleFollowToggle(
                                                        follower._id,
                                                        followings.some(
                                                            (f) =>
                                                                f._id ===
                                                                follower._id
                                                        )
                                                            ? "unfollow"
                                                            : "follow"
                                                    )
                                                }
                                            >
                                                {followings.some(
                                                    (f) =>
                                                        f._id === follower._id
                                                )
                                                    ? "Unfollow"
                                                    : "Follow"}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === "following" && (
                    <div className="tab-panel">
                        <h3>Following</h3>
                        {followings.length === 0 ? (
                            <p>Not following anyone yet.</p>
                        ) : (
                            <ul className="responsive-list">
                                {followings.map((following, index) => (
                                    <li key={index} className="list-item">
                                        <div className="profile-item">
                                            <div className="profile-avatar">
                                                {following.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="profile-details">
                                                <span>{following.name}</span>
                                            </div>
                                            <button
                                                className="follow-btn"
                                                onClick={() =>
                                                    handleFollowToggle(
                                                        following._id,
                                                        "unfollow"
                                                    )
                                                }
                                            >
                                                Unfollow
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === "likedPins" && (
                    <div className="tab-panel">
                        <h3>Liked Pins</h3>
                        {likedPins.length === 0 ? (
                            <p>No liked pins yet.</p>
                        ) : (
                            <ul className="liked-pins-list">
                                {likedPins.map((pin, index) => (
                                    <li key={index} className="liked-pin-item">
                                        <Link to={`/detail/${pin.pinId}`}>
                                            <img
                                                src={pin.imageUrl}
                                                alt={`Pin ${index}`}
                                                className="liked-pin-image"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
