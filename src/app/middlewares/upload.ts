import multer, { Multer } from "multer";
import { fileConfig } from "../../config/file.ts";

const storage = multer.memoryStorage();

const createUploader = (maxBytes: number): Multer =>
    multer({
        storage,
        limits: {
            fileSize: maxBytes,
            files: 1,
        },
    });

const uploadImage = createUploader(fileConfig.maxImageSize);
const uploadDocument = createUploader(fileConfig.maxDocumentSize);
const uploadVideo = createUploader(fileConfig.maxVideoSize);

export { uploadDocument, uploadImage, uploadVideo ,createUploader};
