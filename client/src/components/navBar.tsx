// Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navBar.css";

interface NavbarProps {
    onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    const navigate = useNavigate(); // React Router's navigation hook

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await localStorage.getItem("name");
                setUserName(data || ""); // Assume the API returns a name
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        onSearchChange(e.target.value); // Pass search query to parent
    };

    const getInitials = (name: string) => {
        const nameParts = name.split(" ");
        return nameParts[0]?.[0] || ""; // Get the first letter of the first name
    };

    const handleProfileClick = () => {
        navigate("/profile"); // Redirect to the profile page
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <Link to="/home">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
                            alt="Pinterest Logo"
                        />
                    </Link>
                </div>
                <Link to="/home" className="navbar-link">
                    <button className="navbar-home">Home</button>
                </Link>
                <Link to="/explore" className="navbar-link">
                    <button className="navbar-explore">Explore</button>
                </Link>
                <Link to="/create" className="navbar-link">
                    <button className="navbar-create">Create</button>
                </Link>
            </div>

            <div className="navbar-search">
                <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search tags"
                />

                <button className="navbar-profile" onClick={handleProfileClick}>
                    <div className="profileimg">{getInitials(userName)}</div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
