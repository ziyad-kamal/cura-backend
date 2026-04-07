import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { fileConfig } from "../../config/file.ts";
import { ErrorInterface } from "../../interfaces/errors/ErrorInterface.ts";
import { returnError } from "../utils/returnJson.ts";
import NotFoundError from "./NotFoundError.ts";

const errorHandler = (err: ErrorInterface, req: Request, res: Response, next: NextFunction): Response | void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof NotFoundError) {
        return returnError(res, err.message, err.statusCode);
    }

    if (err instanceof multer.MulterError) {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            statusCode = 413;

            if (err.field === "image") {
                message = `Maximum allowed ${err.field} size is ${fileConfig.maxImageSize}`;
            } else if (err.field === "video") {
                message = `Maximum allowed file size is ${fileConfig.maxVideoSize}`;
            } else {
                message = `Maximum allowed file size is ${fileConfig.maxDocumentSize}`;
            }
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
