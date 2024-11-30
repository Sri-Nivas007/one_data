import { CustomRequest } from "./authControllers";
import { Request, Response } from "express";
import Pin from "../models/Pin";
import User from "../models/User";
// Import the S3 service

// Create a new pin
export const createPin = async (
    req: CustomRequest,
    res: Response
): Promise<any> => {
    // Changed void to any
    console.log(2323232);
    const { title, description, tags } = req.body; // Get title, description, and tags

    const imageUrl: any = req.file; // Get the uploaded file from req.file

    try {
        // Check if the user_id exists
        if (!req.userId) {
            return res.status(400).json({
                message: "User ID is required to create a pin",
            });
        }

        // Check if the image file was uploaded
        if (!imageUrl) {
            return res.status(400).json({
                message: "Image is required to create a pin",
            });
        }
        const parsedTags = Array.isArray(tags)
            ? tags
            : tags.split(",").map((tag: string) => tag.trim());

        // Create a new Pin
        const newPin = new Pin({
            title,
            description,
            imageUrl: imageUrl.location, // Use the S3 key for the image URL
            tags: parsedTags, // Tags should be an array
            user_id: req.userId, // Store user_id in the pin
        });

        // Save the new Pin to the database
        await newPin.save();

        // Send success response
        return res.status(201).json({
            message: "Pin created successfully",
            pin: {
                ...newPin.toObject(),
                imageUrl: imageUrl,
            },
        });
    } catch (err) {
        console.log("err", err);
        return res.status(500).json({
            message: "Server error during pin creation",
            error: err,
        });
    }
};

// Get all images
export const getImages = async (
    req: CustomRequest,
    res: Response
): Promise<any> => {
    try {
        // Fetch the pins, sorted by the most recent (_id field) in descending order
        const pins = await Pin.find({}, "imageUrl") // Retrieve imageUrl field
            .select("_id imageUrl tags") // Select specific fields
            .sort({ _id: -1 }); // Sort by _id field in descending order

        // Map the pins and send the response
        const response = pins.map((pin) => ({
            id: pin._id, // Mongoose returns _id by default
            image_url: pin.imageUrl,
            tags: pin.tags,
        }));

        // Send the response to the client
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Pin Detail
export const getPinDetail = async (
    req: CustomRequest,
    res: Response
): Promise<any> => {
    // Changed void to any
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Pin ID is required." });
        }

        // Query to find the pin by its ID and populate user data
        const pin: any = await Pin.findById(id)
            .populate({
                path: "user_id",
                select: "name email followers",
            })
            .exec();

        if (!pin) {
            return res.status(404).json({ message: "Pin not found." });
        }

        const userId = req.userId as any;

        // Check if the current user has liked the post
        const isLiked = pin.likes.includes(userId);

        // Check if the current user is following the pin's owner
        const isFollow = pin.user_id.followers.includes(userId);

        // Process tags into a string concatenated with #
        const tags = pin.tags.map((tag: string) => `#${tag}`).join(" "); // Joining tags with space

        // Format the response
        const data = {
            imageUrl: pin.imageUrl,
            user: pin.user_id, // Populated user data
            likesCount: pin.likes.length, // Count of likes
            isLiked: isLiked, // Add whether the user has liked the pin
            isFollow: isFollow, // Add whether the user is following the pin's owner
            title: pin.title,
            description: pin.description,
            tags: tags, // Include the concatenated tags
        };

        return res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching pin details:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Like or Unlike Pin
export const likeController = async (
    req: CustomRequest,
    res: Response
): Promise<any> => {
    // Changed void to any
    try {
        const { id } = req.params;
        const userId = req.userId; // Assuming userId is added to request by verifyToken middleware

        // Find the post (pin) by its ID
        const post: any = await Pin.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the user who is liking or unliking the post
        const user: any = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has already liked the post
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike the post
            post.likes = post.likes.filter(
                (user: { toString: () => string | undefined }) =>
                    user.toString() !== userId
            );
            user.liked_pins = user.liked_pins.filter(
                (pinId: { toString: () => string }) => pinId.toString() !== id
            );
        } else {
            // Like the post
            post.likes.push(userId);
            user.liked_pins.push(id);
        }

        // Save both the post and user after the changes
        await post.save();
        await user.save();

        // Respond with a message and the updated like count
        return res.status(200).json({
            message: isLiked ? "Post unliked" : "Post liked",
            likesCount: post.likes.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Follow or Unfollow User
export const followController = async (
    req: CustomRequest,
    res: Response
): Promise<any> => {
    // Changed void to any
    try {
        const { id } = req.params;
        const userId = req.userId;

        const targetUser: any = await User.findById(id);
        const currentUser: any = await User.findById(userId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.followings.includes(id);

        if (isFollowing) {
            // Unfollow the user
            currentUser.followings = currentUser.followings.filter(
                (user: { toString: () => string }) => user.toString() !== id
            );
            targetUser.followers = targetUser.followers.filter(
                (user: { toString: () => string | undefined }) =>
                    user.toString() !== userId
            );
        } else {
            // Follow the user
            currentUser.followings.push(id);
            targetUser.followers.push(userId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            message: isFollowing ? "Unfollowed user" : "Followed user",
            followersCount: targetUser.followers.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
