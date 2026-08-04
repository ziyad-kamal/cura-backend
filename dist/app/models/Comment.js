import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 250,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    repost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repost",
    },
}, {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
});
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ repost: 1, createdAt: -1 });
commentSchema.virtual("likesCount", {
    ref: "Like",
    localField: "_id",
    foreignField: "comment",
    count: true,
});
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
//# sourceMappingURL=Comment.js.map