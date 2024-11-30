import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Createpin } from "../api/api";
import "../styles/pinCreate.css"; // Your custom styles

const CreatePinPage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [tags, setTags] = useState<string[]>([]); // Tags as an array
    const [loading, setLoading] = useState(false); // State for loading
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // For holding error messages
    const navigate = useNavigate();

    // Handle image selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    // Validate URL format
    const validateUrl = (url: string): boolean => {
        const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
        return regex.test(url);
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Validate title
        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        // Validate description
        if (!description.trim()) {
            newErrors.description = "Description is required";
        }

        // Validate link
        if (!link.trim()) {
            newErrors.link = "Link is required";
        } else if (!validateUrl(link)) {
            newErrors.link = "Please enter a valid URL";
        }

        // Validate tags
        if (tags.length === 0) {
            newErrors.tags = "At least one tag is required";
        }

        // Validate image
        if (!image) {
            newErrors.image = "Image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submitting
        if (!validateForm()) {
            return; // If validation fails, do not submit
        }

        setLoading(true); // Show loading

        // Prepare form data
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("link", link);

        // Append tags
        tags.forEach((tag) => formData.append("tags[]", tag));

        if (image) {
            formData.append("imageUrl", image);
        }

        try {
            // Call the API
            await Createpin(formData);

            // Show success alert
            alert("Pin created successfully!");

            // Clear form fields after success
            setTitle("");
            setDescription("");
            setLink("");
            setTags([]);
            setImage(null);

            navigate("/home");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to create pin. Please try again.");
        } finally {
            setLoading(false); // Hide loading
        }
    };

    return (
        <div className="create-pin-page">
            <div className="create-pin-content">
                {/* Loading Indicator */}
                {loading && <div className="loading-overlay"></div>}

                {/* Image upload section */}
                <div className="image-section">
                    <input
                        type="file"
                        accept="image/*"
                        id="file-input"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <label htmlFor="file-input" className="upload-area">
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Pin"
                                className="preview-img"
                            />
                        ) : (
                            <div className="upload-placeholder">
                                <span>
                                    Choose a file or drag and drop it here
                                </span>
                            </div>
                        )}
                    </label>
                    {/* Display image error message */}
                    {errors.image && (
                        <span className="error">{errors.image}</span>
                    )}
                </div>

                {/* Form to create a pin */}
                <div className="form-section">
                    <form onSubmit={handleSubmit} className="pin-form">
                        {/* Title input */}
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Add a title"
                                required
                            />
                            {/* Display title error message */}
                            {errors.title && (
                                <span className="error">{errors.title}</span>
                            )}
                        </div>

                        {/* Description input */}
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a detailed description"
                                required
                            />
                            {/* Display description error message */}
                            {errors.description && (
                                <span className="error">
                                    {errors.description}
                                </span>
                            )}
                        </div>

                        {/* Link input */}
                        <div className="form-group">
                            <label htmlFor="link">Link</label>
                            <input
                                type="url"
                                id="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Add a link"
                                required
                            />
                            {/* Display link error message */}
                            {errors.link && (
                                <span className="error">{errors.link}</span>
                            )}
                        </div>

                        {/* Tags input */}
                        <div className="form-group">
                            <label htmlFor="tags">Tagged topics</label>
                            <input
                                type="text"
                                id="tags"
                                value={tags.join(", ")} // Display tags as a comma-separated string
                                onChange={(e) =>
                                    setTags(
                                        e.target.value
                                            .split(",")
                                            .map((tag) => tag.trim()) // Split input into individual tags
                                    )
                                }
                                placeholder="Search for a tag"
                                required
                            />
                            {/* Display tags error message */}
                            {errors.tags && (
                                <span className="error">{errors.tags}</span>
                            )}
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="submit-btn">
                            {loading ? "Creating..." : "Create Pin"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePinPage;
