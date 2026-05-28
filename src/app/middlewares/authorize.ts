import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { findRecord } from "../utils/findRecord.js";
import { OwnerInterface } from "../../interfaces/data/OwnerInterface.js";
import { returnError } from "../utils/returnJson.js";

export const authorize = <T extends OwnerInterface>(model: Model<T>, param: string, field: keyof T='user') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[param] as string;
        const record = await findRecord(model, { _id: id });

        const ownerId = record[field];

        if (ownerId?.toString() !== req.user?._id) {
            returnError(res, "something went wrong", 500);
        }

        next();
    };
};
