import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import {
    deletePostRepo,
    likePostRepo,
    storePostRepo,
    updatePostRepo,
} from "../../repositories/users/postRepository.js";
import { getNextCursor, getQueryCursor } from "../../utils/cursorPagination.js";
import { indexProfileRepo } from "../../repositories/users/profileRepository.js";

export const indexProfileService = async (req: Request) => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const profile = await indexProfileRepo(query, limit, req.params.userId as string,req.user?._id);

    const { hasMore, nextCursor, results } = getNextCursor(profile.posts, limit, sortField);

    return { metadata: { hasMore, nextCursor }, posts: results, user: profile.user };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    return await storePostRepo({ ...req.body, user: req.user?._id });
};

export const updatePostService = async (req: Request): Promise<PostInterface | null> => {
    return await updatePostRepo({ ...req.body, ...req.params });
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
