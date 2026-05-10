import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import { PaginationType } from "../../../types/PaginationType.js";
import { indexPostsRepo, storePostRepo } from "../../repositories/users/postRepository.js";
import { getNextCursor, getQueryCursor } from "../../utils/index.js";

export const indexPostsService = async (req: Request): Promise<PaginationType<PostInterface, "posts">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const posts = await indexPostsRepo(query, limit);

    const { hasMore, nextCursor, results } = getNextCursor(posts, limit, sortField);

    return { metaData: { hasMore, nextCursor }, posts: results };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    const post = await storePostRepo(req);
    return post;
};
