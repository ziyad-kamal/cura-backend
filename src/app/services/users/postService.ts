import { Request, Response } from "express";
import {  getQueryCursor, getNextCursor} from '../../utils/index.js';
import { getPostsRepo } from "../../repositories/users/postRepository.js";
import { PaginationType } from "../../../types/PaginationType.js";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";

export const getPostsService = async (req: Request, res: Response): Promise<PaginationType<PostInterface, "posts">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const posts = await getPostsRepo(query, limit);

    const { hasMore, nextCursor, results } = getNextCursor(posts, limit, sortField);

    return { metaData: { hasMore, nextCursor }, posts: results };
};

