import { Request, Response } from "express";
import {
    destroyRepostService,
    likeRepostService,
    storeRepostService,
    updateRepostService,
} from "../../../services/users/community/repostService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isRepost = await storeRepostService(req);
    const msg = isRepost ? "you repost successfully" : "you unrepost successfully";
    return returnSuccess(res, msg, 200, { isRepost });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await updateRepostService(req);
    return returnSuccess(res, "you updated repost successfully", 200, { post });
});

export const like = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isLike = await likeRepostService(req);
    const msg = isLike ? "you like repost successfully" : "you unlike repost successfully";
    return returnSuccess(res, msg, 200, { isLike });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await destroyRepostService(req);
    return returnSuccess(res, "you deleted repost successfully", 200);
});
