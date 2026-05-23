import { Request } from "express";
import {
    deletePostRepo,
    likePostRepo,
} from "../../repositories/users/postRepository.js";
import { getNextCursor, getQueryCursor } from "../../utils/cursorPagination.js";
import { indexProfileRepo, updateProfileRepo } from "../../repositories/users/profileRepository.js";

export const indexProfileService = async (req: Request) => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const profile = await indexProfileRepo(query, limit, req.params.userId as string,req.user?._id);

    const { hasMore, nextCursor, results } = getNextCursor(profile.posts, limit, sortField);

    return { metadata: { hasMore, nextCursor }, posts: results, user: profile.user };
};

export const updateProfileService = async (req: Request): Promise<void> => {
    const authId = req.user?._id as string; 
    return await updateProfileRepo({...req.body} ,authId);
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
