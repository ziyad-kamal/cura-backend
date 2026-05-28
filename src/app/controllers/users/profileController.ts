import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";
import { connectProfileService, indexProfileService, updateProfileService } from "../../services/users/profileService.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const profile = await indexProfileService(req);
    return returnSuccess(res, "", 200, profile);
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const user = await updateProfileService(req);
    return returnSuccess(res, "you updated profile successfully", 200, { user });
});

export const connect = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await connectProfileService(req);
    return returnSuccess(res, "you deleted comment successfully", 200);
});
