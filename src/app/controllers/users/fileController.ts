import { Request, Response } from "express";
import { asyncHandler } from '../../utils/asyncHandler.js';
import { returnSuccess } from '../../utils/returnJson.js';
import { uploadFileService } from "../../services/users/fileService.js";

export const upload = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const file = await uploadFileService(req);
    return returnSuccess(res, "", 200, { file });
});




