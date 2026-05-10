import { Request } from "express";
import {   uploadFile} from '../../utils/index.js';

export const uploadFileService = async (req: Request): Promise<string> => {
    const {type} = req.body;
    let file;
    if (type === 'video') {
        file =await uploadFile(req,'public/videos')
    }else if (type === "document") {
        file = await uploadFile(req, "public/documents");
    }else{
        file = await uploadFile(req, "public/images",300);
    }

    return file;
};
