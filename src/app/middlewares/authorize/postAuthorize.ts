import Post from "@/app/models/Post.js";
import { findRecord } from "@/app/utils/findRecord.js";
import { returnError } from "@/app/utils/returnJson.js";
import { NextFunction, Request, Response } from "express";

export const postAuthorize = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params._id as string;
    const postRecord = await findRecord(Post, { _id: id });

    if (postRecord.user.toString() !== req.user?._id) {
        returnError(res, "something went wrong", 500);
    }
    next();
};
