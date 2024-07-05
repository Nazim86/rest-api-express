import {
  DeleteObjectCommand,
  DeleteObjectsCommand, GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from "inversify";

@injectable()
export class S3StorageAdapter {

  private s3Client: S3Client;
  private bucketName: string;

  constructor() {

    this.bucketName = process.env.AMAZON_CLOUD_BUCKET_NAME;

    const REGION = 'eu-north-1';


    this.s3Client = new S3Client({
      region: REGION,
      endpoint: process.env.AMAZON_CLOUD_URL,
      credentials: {
        secretAccessKey: process.env.AMAZON_CLOUD_SECRET_KEY,
        accessKeyId: process.env.AMAZON_CLOUD_KEY_ID,
      },
    });
  }

  async uploadFile(userId, filedata): Promise<{ key: string; url: string; fileId: string | undefined }> {
    const fileType = filedata.mimetype.split('/')[0]
    const format = filedata.mimetype.split('/')[1]
    const key = `content/${userId}/${fileType}/${uuidv4()}.${format}`;

    const bucketParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: filedata.buffer,
      ContentType: filedata.contentType,
    };

    try {
      const command:PutObjectCommand = new PutObjectCommand(bucketParams);

      const uploadResult = await this.s3Client.send(command);
      return {
        key:key,
        url: this.getUrlFile(key),
        fileId: uploadResult.$metadata.requestId,
      };
    } catch (exception) {
      throw exception;
    }
  }

  async downloadFile(file){
    const bucketParams = {
      Bucket: this.bucketName,
      Key: file.key,
    };

    try {
      const command:GetObjectCommand = new GetObjectCommand(bucketParams);

      const { Body, ContentType, ContentLength } = await this.s3Client.send(command);

      return {Body, ContentType,ContentLength}
      // return {
      //
      //   url: this.getUrlFile(key),
      //   fileId: uploadResult.$metadata.requestId,
      // };
    } catch (exception) {
      console.log("exception",exception)
      throw exception;
    }

  }

  async deleteAvatar(key: string) {
    const bucketParams = { Bucket: this.bucketName, Key: key };
    try {
      return await this.s3Client.send(new DeleteObjectCommand(bucketParams));
    } catch (exception) {
      throw exception;
    }
  }

  async deleteImages(keys: string[]) {
    const objectsToDelete = keys.map((key) => ({ Key: key }));

    const bucketParams = {
      Bucket: this.bucketName,
      Delete: { Objects: objectsToDelete },
      Quiet: false,
    };
    return await this.s3Client.send(new DeleteObjectsCommand(bucketParams));
  }

  getUrlFile(url: string) {
    return `https://funny-team.s3.eu-north-1.amazonaws.com/${url}`;
  }
}
