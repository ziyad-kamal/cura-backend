import { GetObjectCommand } from "@aws-sdk/client-s3";
import { awsConfig, s3Client } from "../../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getSignedFileUrl = async (s3Key: string): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: awsConfig.s3_bucket_name,
        Key: s3Key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};