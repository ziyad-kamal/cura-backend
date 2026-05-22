import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";
import { destroyCommentService, likeCommentService, storeCommentService, updateCommentService } from "../../services/users/commentService.js";
import { indexProfileService } from "../../services/users/profileService.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const profile = await indexProfileService(req);
    return returnSuccess(res, "", 200, profile);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const comment = await storeCommentService(req);
    return returnSuccess(res, "you created comment successfully", 200, { comment });
});

export const like = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const comment = await likeCommentService(req);
    return returnSuccess(res, "you liked comment successfully", 200, { comment });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const comment = await updateCommentService(req);
    return returnSuccess(res, "you updated comment successfully", 200, { comment });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await destroyCommentService(req);
    return returnSuccess(res, "you deleted comment successfully", 200);
});
