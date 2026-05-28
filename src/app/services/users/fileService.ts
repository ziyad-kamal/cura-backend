import { Request } from "express";
import NotFoundError from "../../errors/NotFoundError.js";
import path from "path";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { awsConfig, s3Client } from "../../../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { getSignedFileUrl } from "../../utils/getSignedFileUrl.js";

export const uploadFileService = async (req: Request): Promise<object> => {
    const { fileType, fileName } = req.body;

    const extension = path.extname(fileName);

    const uniqueFileName = `${crypto.randomBytes(16).toString("hex")}${extension}`;
    const s3Key = `staging/${uniqueFileName}`;

    const command = new PutObjectCommand({
        Bucket: awsConfig.s3_bucket_name,
        Key: s3Key,
        ContentType: fileType,
        ChecksumAlgorithm: undefined,
    });

    let tmpUploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 900,
    });

    const url = await getSignedFileUrl(s3Key);

    return { tmpUploadUrl, s3Key, url };
};

export const downloadFileService = async (req: Request): Promise<string> => {
    const { s3Key } = req.body;

    if (!s3Key) {
        throw new NotFoundError("Missing required s3Key.");
    }

    const command = new GetObjectCommand({
        Bucket: awsConfig.s3_bucket_name,
        Key: s3Key,
        ResponseContentDisposition: `attachment; filename="${s3Key.split("/").pop()}"`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 1 min is enough for download

    return url;
};

export const destroyFileService = async (req: Request): Promise<void> => {
    const { s3Key } = req.query;

    if (!s3Key) {
        throw new NotFoundError("File not found");
    }

    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: awsConfig.s3_bucket_name,
            Key: s3Key as string,
        }),
    );
};
