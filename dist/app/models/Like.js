import mongoose, { Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
const likeSchema = new Schema({
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
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
likeSchema.index({ user: 1, post: 1 });
likeSchema.index({ user: 1, repost: 1 });
likeSchema.index({ user: 1, comment: 1 });
const Like = mongoose.model("Like", likeSchema);
export default Like;
//# sourceMappingURL=Like.js.map