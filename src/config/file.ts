import { FileInterface } from "../interfaces/config/FileInterface.ts";

export const fileConfig: FileInterface = {
    maxImageSize: 5 * 1024 * 1024, // 5 mg
    maxVideoSize: 200 * 1024 * 1024,
    maxDocumentSize: 10 * 1024 * 1024,
};
