import { HydratedDocument } from "mongoose";
import Like from "../../models/Like.js";
import { findRecord } from "../../utils/findRecord.js";
import Repost from "../../models/Repost.js";
import { RepostDataInterface } from "../../../interfaces/data/RepostDataInterface.js";
import { RepostInterface } from "../../../interfaces/models/RepostInterface.js";
import RecordExistError from "../../errors/RecordExistError.js";
import Comment from "../../models/Comment.js";

export const storeRepostRepo = async ({ content, post }: RepostDataInterface, authId: string,repostId:string): Promise<boolean> => {
    await findRecord(Repost, { _id: repostId });
    const existingRepost = await Repost.findOne({ _id: repostId, user: authId });

    if (existingRepost) {
        throw new RecordExistError("you already reposted this post before");
    }

    await Repost.create({ content, post, user: authId });
    return true;
};

export const updateRepostRepo = async ({
    content,
    _id,
}: RepostDataInterface): Promise<HydratedDocument<RepostInterface> | null> => {
    await findRecord(Repost, { _id });

    return await Repost.findByIdAndUpdate(_id, { content }, { returnDocument: "after", runValidators: true }).populate(
        "user",
        "name.first name.last image",
    );
};

export const likeRepostRepo = async (_id: string, authId: string): Promise<boolean> => {
    const repost = await findRecord(Repost, { _id });
    const like = await Like.findOne({ repost: repost._id, user: authId });

    if (like) {
        await Like.deleteOne({ _id: like._id });
        return false;
    }

    await Like.create({ repost: repost._id, user: authId });
    return true;
};

export const destroyRepostRepo = async (_id: string): Promise<void> => {
    const repost = await findRecord(Repost, { _id });
    await repost.deleteOne({_id})
    await Like.deleteMany({ repost: _id });
    await Comment.deleteMany({ repost: _id });
};
