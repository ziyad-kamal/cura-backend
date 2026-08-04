import { Request, Response } from "express";
import { asyncHandler } from '../../utils/asyncHandler.js';
import { returnSuccess } from '../../utils/returnJson.js';
import { destroyFileService, downloadFileService, uploadFileService } from "../../services/users/fileService.js";
import { awsConfig } from "../../../config/aws.js";

export const upload = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const file = await uploadFileService(req);
    return returnSuccess(res, "you uploaded file successfully", 200, { file });
});

export const download = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const url = await downloadFileService(req);
    return returnSuccess(res, "File download URL generated successfully", 200, { url });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await destroyFileService(req);

    return returnSuccess(res, "you deleted file successfully", 200);
});



