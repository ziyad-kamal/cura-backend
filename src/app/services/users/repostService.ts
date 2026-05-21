import { Request } from "express";
import { likeRepostRepo, storeRepostRepo, updateRepostRepo } from "@/app/repositories/users/repostRepository.js";
import { RepostInterface } from "@/interfaces/models/RepostInterface.js";

export const storeRepostService = async (req: Request): Promise<boolean> => {
    return await storeRepostRepo({ ...req.body }, req.user?._id);
};

export const updateRepostService = async (req: Request): Promise<RepostInterface | null> => {
    return await updateRepostRepo({ ...req.body, ...req.params });
};

export const likeRepostService = async (req: Request): Promise<boolean> => {
    return await likeRepostRepo(req.params._id as string, req.user?._id);
};
