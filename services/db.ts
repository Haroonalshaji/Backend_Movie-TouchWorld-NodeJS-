// Importing mongoose
import mongoose, { Schema, Document } from 'mongoose';

// Define interface for the MongoDB document
interface Post extends Document {
    id: string;
    title: string;
    director: string;
    release_date: string;
    rating: string;
    userId: string;
}

interface User extends Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema<User> = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

// Define the Mongoose schema for Post
const PostSchema: Schema<Post> = new Schema<Post>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    director: { type: String, required: true },
    release_date: { type: String, required: true },
    rating: { type: String, required: true },
});

// Define the Mongoose model using the Post interface and PostSchema
const PostModel = mongoose.model<Post>('movies', PostSchema);

const UserModel = mongoose.model<User>('users', UserSchema);

// Export the Mongoose model
export default {
    posts: PostModel,
    users: UserModel
};
