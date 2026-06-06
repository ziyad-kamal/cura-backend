import { Request, Response } from "express";
import {
    acceptProfileService,
    connectProfileService,
    ignoreProfileService,
    indexProfileService,
    updateProfileService,
} from "../../../services/users/community/profileService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";

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
    return returnSuccess(res, "you sent request successfully", 200);
});

export const accept = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await acceptProfileService(req);
    return returnSuccess(res, "you accepted request successfully", 200);
});

export const ignore = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await ignoreProfileService(req);
    return returnSuccess(res, "you ignored request successfully", 200);
});
