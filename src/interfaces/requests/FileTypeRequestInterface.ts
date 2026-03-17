import { Request } from "express";
import { FileTypeResult } from "file-type";

export interface FileTypeRequestInterface extends Request {
    // eslint-disable-next-line no-undef
    file?: Express.Multer.File;
    realFileType?: FileTypeResult;
}
