import { NextFunction, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import { FileTypeRequestInterface } from "../../interfaces/requests/FileTypeRequestInterface.ts";
import { returnError } from "../utils/returnJson.ts";

export const verifyFileType = async (
    req: FileTypeRequestInterface,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    if (!req.file) {
        return returnError(res, "no file uploaded", 400);
    }

    try {
        const detected = await fileTypeFromBuffer(req.file.buffer);

        if (!detected) {
            return returnError(res, "Unable to detect file type", 400);
        }

        const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

        if (!allowed.has(detected.ext)) {
            return returnError(
                res,
                `Invalid file content. Detected: ${detected.mime} (${detected.ext}), allowed: images only`,
                422,
            );
        }

        req.realFileType = detected;

        next();
        // eslint-disable-next-line no-unused-vars
    } catch (err) {
        return returnError(res, "File processing failed", 500);
    }
};
