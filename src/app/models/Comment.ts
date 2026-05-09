import mongoose, { Model, Schema } from "mongoose";
import { CommentInterface } from '../../interfaces/models/CommentInterface.js';

const commentSchema = new Schema<CommentInterface>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxLength: 250,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

commentSchema.index({ post: 1, createdAt: -1 });

const Comment: Model<CommentInterface> = mongoose.model<CommentInterface>("Comment", commentSchema);

export default Comment;
