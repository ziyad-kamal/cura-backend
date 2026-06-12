import { Model } from "mongoose";
import UnknownError from "../errors/UnknownError.js";
import { findRecord } from "../utils/findRecord.js";
import { NextFunction, Request, Response } from "express";

export const authorize = <T>(model: Model<T>, param: string, fields: (keyof T)[] = ["user" as keyof T]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[param] as string;
        const record = await findRecord(model, { _id: id });
        const authorized = fields.some((field) => record[field]?.toString() === req.user?._id);

        if (!authorized) {
            throw new UnknownError();
        }

        next();
    };
};
