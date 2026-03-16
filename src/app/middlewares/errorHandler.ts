import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ErrorInterface } from "../../interfaces/ErrorInterface.ts";
import { returnError } from "../utils/returnJson.ts";

const errorHandler = (
    err: ErrorInterface,
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof multer.MulterError) {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            statusCode = 413;
            message = "Maximum allowed file size is 5MB";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected field or too many files uploaded";
        } else if (err.code === "LIMIT_FILE_COUNT") {
            message = "Too many files uploaded";
        } else {
            message = "Upload failed";
        }
    }

    return returnError(res, message, statusCode);
};

export default errorHandler;
