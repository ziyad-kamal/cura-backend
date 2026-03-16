import { Request } from "express";

export interface PostRequestInterface extends Request {
    body: {
        title: string;
        content: string;
        author: string;
    };
    // eslint-disable-next-line no-undef
    file?: Express.Multer.File;
}
