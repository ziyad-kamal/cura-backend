import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";
import { destroyCommentService } from "../../services/users/commentService.js";
import { indexProfileService, updateProfileService } from "../../services/users/profileService.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const profile = await indexProfileService(req);
    return returnSuccess(res, "", 200, profile);
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const comment = await updateProfileService(req);
    return returnSuccess(res, "you updated comment successfully", 200, { comment });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await destroyCommentService(req);
    return returnSuccess(res, "you deleted comment successfully", 200);
});
