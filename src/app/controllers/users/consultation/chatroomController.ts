import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
import { checkUsersStatusService, getChatroomService, indexChatroomsService } from "../../../services/users/consultation/chatroomService.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const chatrooms = await indexChatroomsService(req);
    return returnSuccess(res, "", 200, chatrooms);
});

export const get = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const chatroom = await getChatroomService(req);
    return returnSuccess(res, "", 200, chatroom);
    
});

export const checkUsersStatus = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const onlineStatusMap = await checkUsersStatusService(req);
    return returnSuccess(res, "", 200, {onlineStatusMap});
});
