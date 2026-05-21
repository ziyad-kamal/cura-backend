import { Request, Response } from "express";
import { likeRepostService, storeRepostService, updateRepostService } from "../../services/users/repostService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isRepost = await storeRepostService(req);
    return returnSuccess(res, "", 200, { isRepost });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await updateRepostService(req);
    return returnSuccess(res, "you updated repost successfully", 200, { post });
});

export const like = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isLike = await likeRepostService(req);
    return returnSuccess(res, "", 200, { isLike });
});
