import mongoose, { Document, Schema, Model } from "mongoose";

interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: [true, "Comment cannot be empty"],
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    },
);

commentSchema.index({ post: 1, createdAt: -1 });

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
