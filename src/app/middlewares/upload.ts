import multer, { Multer } from "multer";
import { fileConfig } from '../../config/file.js';

const storage = multer.memoryStorage();

const createUploader = (maxBytes: number): Multer =>
    multer({
        storage,
        limits: {
            fileSize: maxBytes,
            files: 1,
        },
    });

export const uploadImage = createUploader(fileConfig.maxImageSize);

export const uploadMulter = multer({
    storage,

    limits: {
        files: 1,
        fileSize: fileConfig.maxVideoSize, 
    },
});
