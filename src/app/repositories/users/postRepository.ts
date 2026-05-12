import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import Post from "../../models/Post.js";

export const indexPostsRepo = (
    query: {
        [key: string]: unknown;
    },
    limit: number,
) => {
    return Post.find(query)
        .select("user content files createdAt")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "name.first name.last image",
            },
            perDocumentLimit: 2,
            select: "content user createdAt",
            options: { sort: { createdAt: -1 } },
        })
        .populate("commentsCount")
        .populate("likesCount")
        .populate("repostsCount")
        .populate({
            path: "user",
            select: "name.first name.last image",
        })
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean();
};

export const storePostRepo = async (req: Request): Promise<HydratedDocument<PostInterface>> => {
    const { content, files } = req.body;
    const userId = req.user?._id;

    return (await Post.create({ user: userId, content, files })).populate('user');
};
