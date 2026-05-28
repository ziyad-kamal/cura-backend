import "dotenv/config";
import { AwsInterface } from "../interfaces/config/AwsInterface.js";
import { S3Client } from "@aws-sdk/client-s3";

export const awsConfig: AwsInterface = {
    s3_bucket_name: process.env.S3_BUCKET_NAME || "",
    region: process.env.REGION_DEV|| "",
};

export const s3Client = new S3Client({
    region: process.env.REGION_DEV,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID_DEV || "",
        secretAccessKey: process.env.SECRET_KEY || "",
    },
});
