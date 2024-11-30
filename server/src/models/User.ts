import mongoose, { Document, Schema, Types } from "mongoose";

// Define an interface for the User document
interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    followers: IUser["_id"][]; // Array of user IDs
    followings: IUser["_id"][]; // Array of user IDs
    liked_pins: Types.ObjectId[]; // Array of pin IDs
    token?: string; // Optional field for storing token
}

// Define the schema for the User model
const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please fill a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        followers: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            default: [],
        }, // Followers array
        followings: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            default: [],
        }, // Followings array
        liked_pins: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }],
            default: [],
        }, // Liked pins array
        token: {
            type: String, // Token will be stored here
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
