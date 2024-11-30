import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Login as LoginApi } from "../api/api"; // Import the login API
import "../styles/auth.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); // Error state to store error message

    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        // Reset error message before validation
        setError(null);

        // Check if password length is at least 6 characters
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            // Make API call to login
            const response = await LoginApi({ email, password });
            if (response) {
                const token = response.token;
                console.log("token", token);

                localStorage.setItem("token", token);
                localStorage.setItem("name", response.name);
                localStorage.setItem("id", response.id);
                navigate("/home"); // Redirect to /home
            } else {
                alert("Invalid email or password.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
                    alt="Pinterest Logo"
                    className="auth-logo"
                />
                <h2>Welcome to Pinterest</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <div className="error-message">{error}</div>} {/* Display error message if any */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Log In"}
                    </button>
                </form>
                <p className="auth-footer">
                    By continuing, you agree to Pinterest's{" "}
                    <Link to="/terms" className="auth-link">
                        Terms of Service
                    </Link>{" "}
                    and acknowledge you've read our{" "}
                    <Link to="/privacy" className="auth-link">
                        Privacy Policy
                    </Link>
                    .{" "}
                    <Link to="/notice" className="auth-link">
                        Notice at collection
                    </Link>
                    .
                </p>
                <p>
                    Not on Pinterest yet?{" "}
                    <Link to="/signup" className="auth-link">
                        Sign up
                    </Link>
                </p>
                <p>
                    Are you a business?{" "}
                    <Link to="/business" className="auth-link">
                        Get started here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
