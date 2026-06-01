import { Request } from "express";
import { RepostInterface } from "../../../../interfaces/models/RepostInterface.js";
import {
    destroyRepostRepo,
    likeRepostRepo,
    storeRepostRepo,
    updateRepostRepo,
} from "../../../repositories/users/community/repostRepository.js";

export const storeRepostService = async (req: Request): Promise<boolean> => {
    return await storeRepostRepo({ ...req.body }, req.user?._id, req.params._id as string);
};

export const updateRepostService = async (req: Request): Promise<RepostInterface | null> => {
    return await updateRepostRepo({ ...req.body, ...req.params });
};

export const likeRepostService = async (req: Request): Promise<boolean> => {
    return await likeRepostRepo(req.params._id as string, req.user?._id);
};

export const destroyRepostService = async (req: Request): Promise<void> => {
    await destroyRepostRepo(req.params._id as string);
};
