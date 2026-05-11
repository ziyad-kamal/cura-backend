import {Request} from "express";
import {uploadFile} from '../../utils/index.js';

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
