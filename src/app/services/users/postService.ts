import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import { PaginationType } from "../../../types/PaginationType.js";
import { deletePostRepo, indexPostsRepo, likePostRepo, repostRepo, storePostRepo, updatePostRepo } from "../../repositories/users/postRepository.js";
import { getNextCursor, getQueryCursor } from "../../utils/index.js";

export const indexPostsService = async (req: Request): Promise<PaginationType<PostInterface, "posts">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");
    const authId = req.user?._id as string;

    const posts = await indexPostsRepo(query, limit,authId);

    const { hasMore, nextCursor, results } = getNextCursor(posts, limit, sortField);

    return { metadata: { hasMore, nextCursor }, posts: results };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    return await storePostRepo({ ...req.body, user: req.user?._id });
};

export const updatePostService = async (req: Request): Promise<PostInterface|null> => {
    return await updatePostRepo({ ...req.body, ...req.params });
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string,req.user?._id,req.body.type);
};

export const repostService = async (req: Request): Promise<boolean> => {
    return await repostRepo(req.params._id as string, req.user?._id, { ...req.body });
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
