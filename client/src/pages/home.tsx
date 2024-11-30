import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getData, ImageDataResponse } from "../api/api";
import "../styles/home.css";

// Define the structure for rendering image data
type ImageData = {
    id: string;
    src: string;
    sizeClass: string;
    tags: string[];
};

interface HomeProps {
    searchQuery: string;
}

const Home: React.FC<HomeProps> = ({ searchQuery }) => {
    const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    // Fetch images from the server
    const fetchImages = async () => {
        setLoading(true);
        try {
            // Fetch image data from the API
            const imagesData: ImageDataResponse[] = await getData();

            // Format the images for rendering
            const formattedImages: ImageData[] = imagesData.map(
                (pin: ImageDataResponse, index: number) => ({
                    id: pin.id,
                    src: pin.image_url,
                    sizeClass: `span${(index % 4) + 1}`,
                    tags: pin.tags,
                })
            );

            // Filter images based on search query
            const filtered = formattedImages.filter((image) =>
                image.tags.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            setFilteredImages(filtered);
        } catch (error) {
            console.error("Error fetching images:", error);
            setError("Failed to load images.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch images whenever the search query changes
    useEffect(() => {
        fetchImages();
    }, [searchQuery]);

    // Navigate to the detail page with pin ID
    const handleImageClick = (id: string) => {
        navigate(`/detail/${id}`);
    };

    return (
        <div className="home-container">
            {loading && <p>Loading images...</p>}
            {error && <p>{error}</p>}
            <div className="grid-container">
                {filteredImages.map((image) => (
                    <div
                        className={`grid-item ${image.sizeClass}`}
                        key={image.id}
                        onClick={() => handleImageClick(image.id)}
                    >
                        <img
                            src={image.src}
                            alt="Image"
                            className="grid-image"
                        />
                        <div className="overlay">
                            <button className="save-btn">Save</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
