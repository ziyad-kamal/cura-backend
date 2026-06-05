import { Request, Response } from "express";
import { showMessageService } from "../../../services/users/consultation/messageService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";

export const show = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const messages = await showMessageService(req);
    return returnSuccess(res, "", 200, messages);
});
