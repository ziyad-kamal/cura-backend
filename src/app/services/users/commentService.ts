import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import { likePostRepo, repostRepo, storePostRepo, updatePostRepo } from "../../repositories/users/postRepository.js";
import { getNextCursor, getQueryCursor } from "../../utils/cursorPagination.js";
import { PaginationType } from "../../../types/PaginationType.js";
import { CommentInterface } from "../../../interfaces/models/CommentInterface.js";
import { indexCommentRepo, storeCommentRepo } from "../../repositories/users/commentRepository.js";
import Post from "../../models/Post.js";
import Repost from "../../models/Repost.js";
import { RepostInterface } from "../../../interfaces/models/RepostInterface.js";
import { Model } from "mongoose";

export const indexCommentService = async (req: Request): Promise<PaginationType<CommentInterface, "comments">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const post: Model<PostInterface | RepostInterface> = req.params.type === "post" ? Post : Repost;
    const comments = await indexCommentRepo(query, limit, post, req.params._id as string);

    const { hasMore, nextCursor, results } = getNextCursor(comments, limit, sortField);

    return { metadata: { hasMore, nextCursor }, comments: results };
};

export const storeCommentService = async (req: Request): Promise<PostInterface> => {
    return await storeCommentRepo({ ...req.body, user: req.user?._id });
};

export const updatePostService = async (req: Request): Promise<PostInterface | null> => {
    return await updatePostRepo({ ...req.body, ...req.params });
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id, req.body.type);
};

export const repostService = async (req: Request): Promise<boolean> => {
    return await repostRepo(req.params._id as string, req.user?._id, req.body.content);
};
