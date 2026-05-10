import { Request, Response } from "express";

import { indexPostsService, storePostService } from "../../services/users/postService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const posts = await indexPostsService(req);
    return returnSuccess(res, "", 200, posts);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await storePostService(req);
    return returnSuccess(res, "", 200, { post });
});
