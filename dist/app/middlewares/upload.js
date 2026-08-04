import multer from "multer";
import { fileConfig } from '../../config/file.js';
const storage = multer.memoryStorage();
const createUploader = (maxBytes) => multer({
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
//# sourceMappingURL=upload.js.map