import { NextFunction, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import { FileTypeRequestInterface } from "../../interfaces/requests/FileTypeRequestInterface.js";
import { returnError } from "../utils/returnJson.js";

const allowedTypeMap = {
    image: ["jpg", "jpeg", "png", "webp"],
    video: ["mp4", "mpeg", "mov"],
    document: ["pdf", "doc", "docx","xls", "xlsx", "ppt", "pptx"],
} as const;

type FileCategory = keyof typeof allowedTypeMap;

export const verifyFileType = (allowedCategories: FileCategory[]) => {
    return async (req: FileTypeRequestInterface, res: Response, next: NextFunction): Promise<Response | void> => {
        if (!req.file) {
            return returnError(res, "No file uploaded", 400);
        }

        try {
            const detected = await fileTypeFromBuffer(req.file.buffer);

            if (!detected) {
                return returnError(res, "Unable to detect file type", 400);
            }

            const allowedExts = allowedCategories.flatMap((cat) => allowedTypeMap[cat]) as string[];

            if (!allowedExts.includes(detected.ext)) {
                return returnError(
                    res,
                    `Invalid file type. Detected: ${detected.mime}, allowed: ${allowedExts.join(", ")}`,
                    422,
                );
            }

            req.realFileType = detected;
            next();
        } catch (err) {
            if (err instanceof Error) {
                return returnError(res, err.message, 500);
            }
        }
    };
};
