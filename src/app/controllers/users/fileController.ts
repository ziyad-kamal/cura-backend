import { Request, Response } from "express";
import { asyncHandler } from '../../utils/asyncHandler.js';
import { returnSuccess } from '../../utils/returnJson.js';
import { downloadFileService, uploadFileService } from "../../services/users/fileService.js";

export const upload = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const file = await uploadFileService(req);
    return returnSuccess(res, "", 200, { file });
});

export const download = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filePath = await downloadFileService(req);
    return res.download(filePath);
});




