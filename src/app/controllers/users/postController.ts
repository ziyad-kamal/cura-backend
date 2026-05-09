import { Request, Response } from "express";

import { asyncHandler } from '../../utils/asyncHandler.js';
import { returnSuccess } from '../../utils/returnJson.js';
import { getPostsService } from "../../services/users/postService.js";

export const get = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const posts=await getPostsService(req, res);
    return returnSuccess(res, "", 200,posts);
});




