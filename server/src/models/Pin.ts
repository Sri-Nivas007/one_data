import mongoose, { Document, Schema } from 'mongoose';

// Define the Pin interface
export interface IPin extends Document {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  user_id: mongoose.Schema.Types.ObjectId; // Reference to the user who created the pin
  likes: mongoose.Schema.Types.ObjectId[]; // Array of User IDs who liked the pin
  createdAt: Date;
  updatedAt: Date;
}

// Define the Pin schema
const pinSchema = new Schema<IPin>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: { type: [String], default: [] }, // Array of tags associated with the pin
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }, // Users who liked the pin
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Pin model
const Pin = mongoose.model<IPin>('Pin', pinSchema);
export default Pin;
