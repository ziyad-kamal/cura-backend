import Comment from "../../../models/Comment.js";
import Like from "../../../models/Like.js";
import { findRecord } from "../../../utils/findRecord.js";
export const indexCommentRepo = async (query, limit, post, _id) => {
    const postRecord = await findRecord(post.model, { _id });
    return await Comment.find(query)
        .select("content  createdAt")
        .populate("likesCount")
        .populate("user", "name.first name.last image")
        .where({ [post.key]: postRecord._id })
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean();
};
export const storeCommentRepo = async ({ content }, user, post, _id) => {
    await findRecord(post.model, { _id });
    return (await Comment.create({ content, user, [post.key]: _id })).populate("user", " name.first name.last image");
};
export const updateCommentRepo = async ({ content }, _id) => {
    await findRecord(Comment, { _id });
    return (await Comment.findByIdAndUpdate(_id, { content }, { returnDocument: "after", runValidators: true }).populate("user", "name.first name.last image"));
};
export const likeCommentRepo = async (_id, authId) => {
    await findRecord(Comment, { _id });
    await Like.create({ user: authId, comment: _id });
};
export const destroyCommentRepo = async (_id) => {
    await findRecord(Comment, { _id });
    await Comment.findByIdAndDelete(_id);
};
//# sourceMappingURL=commentRepository.js.map