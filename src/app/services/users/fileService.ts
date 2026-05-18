import { Request } from "express";
import { uploadFile } from "../../utils/index.js";
import  fs from "fs";
import NotFoundError from "../../errors/NotFoundError.js";
import  path  from 'path';

export const uploadFileService = async (req: Request): Promise<string> => {
    const file = req.file;

    if (!file) {
        throw new Error("No file uploaded");
    }

    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const videoTypes = ["video/mp4", "video/mpeg", "video/quicktime"];

    let uploadedUrl: string;

    if (videoTypes.includes(file.mimetype)) {
        uploadedUrl = await uploadFile(req, "public/videos");
    } else if (imageTypes.includes(file.mimetype)) {
        uploadedUrl = await uploadFile(req, "public/images", 300);
    } else {
        uploadedUrl = await uploadFile(req, "public/documents");
    }

    return uploadedUrl;
};

export const downloadFileService = async (req: Request): Promise<string> => {
    const { url } = req.body;
    const pathname = new URL(url).pathname;
    const filePath = path.join(process.cwd(), pathname);

    if (!pathname.startsWith("/storage")) {
        throw new NotFoundError("File not found");
    }
    
    if (!fs.existsSync(filePath)) {
        throw new NotFoundError("File not found");
    }

    return filePath;
};
