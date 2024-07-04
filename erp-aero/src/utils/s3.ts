import {S3Client} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region:'eu-north-1',
    endpoint: process.env.AMAZON_CLOUD_URL,
    credentials: {
        secretAccessKey: process.env.AMAZON_CLOUD_SECRET_KEY,
        accessKeyId: process.env.AMAZON_CLOUD_KEY_ID,
    },
});