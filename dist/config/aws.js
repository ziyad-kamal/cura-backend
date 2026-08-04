import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
export const awsConfig = {
    s3_bucket_name: process.env.S3_BUCKET_NAME || "",
    region: process.env.REGION || "",
};
export const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.SECRET_KEY || "",
    },
});
//# sourceMappingURL=aws.js.map