import { Request } from "express";
import { PostInterface } from "../../interfaces/models/PostInterface.ts";
import { PaginationInterface } from "../../interfaces/response/PaginationInterface.ts";
import { getPostsRepo } from "../repositories/postRepository.ts";
import { getNextCursor, getQueryCursor } from "../utils/cursorPagination.ts";

const getPostsService = async (req: Request): Promise<PaginationInterface<PostInterface, "posts">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor<PostInterface>(req, "createdAt");

    const posts = await getPostsRepo(query, limit);

    const { hasMore, nextCursor, results } = getNextCursor<PostInterface>(posts, limit, sortField);

    return { metaData: { hasMore, nextCursor }, posts: results };
};

export { getPostsService };
