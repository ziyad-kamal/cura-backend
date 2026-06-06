import crypto from "crypto";
import { Request } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import NotFoundError from "../errors/NotFoundError.js";

export const uploadFile = async (req: Request, dir: string, isImage: boolean, width?: number): Promise<string> => {
    let fileName: string;
    const file = req.file;
    if (!file) {
        throw new NotFoundError("File not found");
    }

    if (isImage) {
        fileName = `${crypto.randomBytes(16).toString("hex")}.webp`;
    } else {
        const extension = path.extname(file.originalname);

        fileName = `${crypto.randomBytes(16).toString("hex")}${extension}`;
    }
    const dirName = process.cwd();

    dir = `/storage/${dir}`;

    const uploadDir = path.join(dirName, dir);
    const fileLocation = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (isImage) {
        await sharp(req.file!.buffer)
            .resize(width, null, { withoutEnlargement: true })
            .webp({
                quality: 100,
                effort: 4,
            })
            .toFile(fileLocation);
    } else {
        fs.writeFileSync(fileLocation, file.buffer);
    }

    const filePath = `${process.env.APP_URL}/${dir.replace(/^public[/\\]?/, "")}/${fileName}`.replace(
        /([^:]\/)\/+/g,
        "$1",
    );

    return filePath;
};
