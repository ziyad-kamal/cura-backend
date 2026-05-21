import { HydratedDocument } from "mongoose";
import Like from "../../models/Like.js";
import Post from "../../models/Post.js";
import { findRecord } from "../../utils/findRecord.js";
import Repost from "../../models/Repost.js";
import { RepostDataInterface } from "../../../interfaces/data/RepostDataInterface.js";
import { RepostInterface } from "../../../interfaces/models/RepostInterface.js";

export const storeRepostRepo = async ({ content, post }: RepostDataInterface, user: string): Promise<boolean> => {
    await findRecord(Post, { _id: post });
    const existingRepost = await Repost.findOne({ post, user });

    if (existingRepost) {
        await Repost.deleteOne({ _id: existingRepost._id });
        return false;
    }

    await Repost.create({ content, post, user });
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
