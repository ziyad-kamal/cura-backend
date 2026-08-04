import mongoose, { Schema } from "mongoose";
import "./Comment.js";
import "./Post.js";
import "./User.js";
const repostSchema = new Schema({
    content: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
repostSchema.index({ user: 1, createdAt: -1 });
repostSchema.index({ post: 1 });
const Repost = mongoose.model("Repost", repostSchema);
export default Repost;
//# sourceMappingURL=Repost.js.map