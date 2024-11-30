import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Signup as signupApi } from "../api/api"; // Rename the imported Signup function

import "../styles/auth.css";

const Signup: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null); // State to store error messages
    const navigate = useNavigate(); // Hook for navigation

    const handleSignup = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        // Reset previous error messages
        setErrors(null);

        // Validate password length
        if (password.length < 6) {
            setErrors("Password must be at least 6 characters long.");
            return;
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setErrors("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            // Make the signup API call
            await signupApi({ name, email, password });
            alert("Signed up successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        if (name === "name") setName(value);
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
                    alt="Pinterest Logo"
                    className="auth-logo"
                />
                <h2>Join Pinterest today</h2>
                <form onSubmit={handleSignup} className="auth-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    {errors && <div className="error-message">{errors}</div>} {/* Display error message */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
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
                    Already a member?{" "}
                    <Link to="/login" className="auth-link">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
