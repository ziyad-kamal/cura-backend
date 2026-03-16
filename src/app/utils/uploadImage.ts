import crypto from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { PostRequestInterface } from "../../interfaces/requests/PostRequestInterface.ts";

const uploadImage = async (
    req: PostRequestInterface,
    dir: string,
    width: number,
): Promise<string> => {
    const fileName = `${crypto.randomBytes(16).toString("hex")}.webp`;
    const dirName = process.cwd();

    dir = `/storage/${dir}`;

    const uploadDir = path.join(dirName, dir);
    const fileLocation = path.join(uploadDir, fileName);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    await sharp(req.file!.buffer)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fileLocation);

    const filePath =
        `${process.env.APP_URL}/${dir.replace(/^public[/\\]?/, "")}/${fileName}`.replace(
            /\/+/g,
            "/",
        );

    return filePath;
};

export default uploadImage;
