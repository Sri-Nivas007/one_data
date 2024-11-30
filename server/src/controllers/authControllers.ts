import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt"; // Use bcrypt for hashing passwords
import User from "../models/User"; // Import the User model
import { generateToken } from "../middlewares/jwt";
import Pin from "../models/Pin";

export type CustomRequest = Request & { userId?: string };

// Handle User Signup
// Assuming User is your mongoose model
export const signup = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    try {
        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required.",
            });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        return res
            .status(201)
            .json({ message: "User signed up successfully!" });
    } catch (err) {
        return res.status(500).json({
            message: "Server error during signup",
            error: err,
        });
    }
};

// Handle User Login
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // Generate token and save it to the user's record
        const token = await generateToken(user._id.toString());
        user.token = token;
        await user.save();

        return res.status(200).json({
            message: "Login successful",
            token,
            name: user.name,
            id: user._id,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server error during login",
            error: err,
        });
    }
};

// Get Profile
export const getProfile = async (
    req: CustomRequest,
    res: Response
): Promise<any> => {
    const userId = req.userId;

    try {
        // If no userId is provided, return an error
        if (!userId) {
            return res.status(400).json({ message: "User not found." });
        }

        // Fetch the user profile from the database
        const userProfile: any = await User.findById(userId)
            .populate("followers")
            .populate("followings");

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Generate a default profile image based on the name's first letter
        const profileImage = userProfile.name
            ? userProfile.name[0].toUpperCase()
            : "U";

        // Fetch the liked pins
        const likedPins = await Pin.find({
            _id: { $in: userProfile.liked_pins },
        });
        const likedPinImages = likedPins.map((pin) => ({
            pinId: pin._id,
            imageUrl: pin.imageUrl,
        }));

        return res.status(200).json({
            name: userProfile.name,
            email: userProfile.email,
            profile_image: profileImage,
            followers: userProfile.followers,
            followings: userProfile.followings,
            liked_pins: likedPinImages,
            created_pins: userProfile.created_pins,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error });
    }
};
