import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import CustomError from "../errors/CustomError.js";
import { awsConfig, s3Client } from "../../config/aws.js";

export const handleS3Files = async (files: { s3Key: string }[]) => {
    let updatedFiles = files || [];

    if (files.length > 0) {
        updatedFiles = await Promise.all(
            files.map(async (file) => {
                if (!file.s3Key) {
                    throw new CustomError("Missing required s3Key in request body.", 422);
                }

                let finalKey = file.s3Key;

                if (file.s3Key.startsWith("staging/")) {
                    finalKey = file.s3Key.replace("staging/", "public/posts/");

                    const bucketName = awsConfig.s3_bucket_name;

                    await s3Client.send(
                        new CopyObjectCommand({
                            Bucket: bucketName,
                            CopySource: encodeURIComponent(`${bucketName}/${file.s3Key}`),
                            Key: finalKey,
                        }),
                    );

                    await s3Client.send(
                        new DeleteObjectCommand({
                            Bucket: bucketName,
                            Key: file.s3Key,
                        }),
                    );
                }

                return {
                    ...file,
                    s3Key: finalKey,
                };
            }),
        );
    }

    return updatedFiles;
};
