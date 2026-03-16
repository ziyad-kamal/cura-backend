import { NextFunction, Request, Response } from "express";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";

interface CustomRequest extends Request {
    // eslint-disable-next-line no-undef
    file?: Express.Multer.File;
    realFileType?: FileTypeResult;
}

export const verifyFileType = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const detected = await fileTypeFromBuffer(req.file.buffer);

        if (!detected) {
            return res
                .status(400)
                .json({ error: "Unable to detect file type" });
        }

        const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

        if (!allowed.has(detected.ext)) {
            return res.status(400).json({
                error: `Invalid file content. Detected: ${detected.mime} (${detected.ext}), allowed: images only`,
            });
        }

        req.realFileType = detected;

        next();
        // eslint-disable-next-line no-unused-vars
    } catch (err) {
        return res.status(500).json({ error: "File processing failed" });
    }
};
