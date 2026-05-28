import { Request } from "express";
import { getNextCursor, getQueryCursor } from "../../utils/cursorPagination.js";
import { connectProfileRepo, indexProfileRepo, updateProfileRepo } from "../../repositories/users/profileRepository.js";
import { UserInterface } from "../../../interfaces/models/UserInterface.js";

export const indexProfileService = async (req: Request) => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const profile = await indexProfileRepo(query, limit, req.params.userId as string,req.user?._id);

    const { hasMore, nextCursor, results } = getNextCursor(profile.posts, limit, sortField);

    return { metadata: { hasMore, nextCursor }, posts: results, user: profile.user };
};

export const updateProfileService = async (req: Request): Promise<UserInterface|null> => {
    return await updateProfileRepo({...req.body} ,req.user?._id as string);
};

export const connectProfileService = async (req: Request): Promise<void> => {
    await connectProfileRepo(req.params._id as string);
};
