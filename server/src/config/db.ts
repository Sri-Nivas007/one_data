import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI as string;

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI); // No need for `useNewUrlParser` and `useUnifiedTopology`
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit application if connection fails
    }
};
