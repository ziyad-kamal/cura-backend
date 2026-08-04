import RecordExistError from "../../../errors/RecordExistError.js";
import Comment from "../../../models/Comment.js";
import Like from "../../../models/Like.js";
import Repost from "../../../models/Repost.js";
import { findRecord } from "../../../utils/findRecord.js";
export const storeRepostRepo = async ({ content, post }, authId, repostId) => {
    await findRecord(Repost, { _id: repostId });
    const existingRepost = await Repost.findOne({ _id: repostId, user: authId });
    if (existingRepost) {
        throw new RecordExistError("you already reposted this post before");
    }
    await Repost.create({ content, post, user: authId });
    return true;
};
export const updateRepostRepo = async ({ content, _id, }) => {
    await findRecord(Repost, { _id });
    return await Repost.findByIdAndUpdate(_id, { content }, { returnDocument: "after", runValidators: true }).populate("user", "name.first name.last image");
};
export const likeRepostRepo = async (_id, authId) => {
    const repost = await findRecord(Repost, { _id });
    const like = await Like.findOne({ repost: repost._id, user: authId });
    if (like) {
        await Like.deleteOne({ _id: like._id });
        return false;
    }
    await Like.create({ repost: repost._id, user: authId });
    return true;
};
export const destroyRepostRepo = async (_id) => {
    const repost = await findRecord(Repost, { _id });
    await repost.deleteOne({ _id });
    await Like.deleteMany({ repost: _id });
    await Comment.deleteMany({ repost: _id });
};
//# sourceMappingURL=repostRepository.js.map