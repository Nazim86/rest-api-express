import {injectable} from "inversify";
import {Repository} from "typeorm";
import {AppDataSource} from "../../../db/db";
import {S3StorageAdapter} from "../s3-storage-adapter.service";
import {Inject} from "@nestjs/common";
import {File} from "../entity/file.entity";
import {FileRepository} from "../db/file.repository";

@injectable()
export class FileService {

    constructor(@Inject(S3StorageAdapter) private readonly s3Service: S3StorageAdapter,
                @Inject(FileRepository) private readonly fileRepository: FileRepository) {
    }


    async uploadFile(userId: string, fileData) {


        const uploadedFile = await this.s3Service.saveAvatar(userId, fileData)

        const file = new File();
        file.id = uploadedFile.fileId!;
        file.url = uploadedFile.url;
        file.name = fileData.originalname;
        file.extension = fileData.mimetype.split('/')[1];
        file.mimeType = fileData.mimetype;
        file.size = fileData.size;
        file.uploadDate = new Date();
        return this.fileRepository.saveFileInfo(file);
    }

    async listFiles(page: number, listSize: number) {
      return this.fileRepository.listFiles(page, listSize)
    }

    async getFile(id: number) {
        return await this.fileRepository.findOneBy({id});
    }

    async deleteFile(id: number) {
        const file = await this.fileRepository.findOneBy({id});
        if (file) {
            await this.fileRepository.remove(file);
            await s3.deleteObject({
                Bucket: 'your-bucket-name',
                Key: file.name,
            }).promise();
        }
    }

    async updateFile(id: number, fileData) {
        const file = await this.fileRepository.findOneBy({id});
        if (file) {
            const oldFileName = file.name;

            file.name = fileData.originalname;
            file.extension = fileData.mimetype.split('/')[1];
            file.mimeType = fileData.mimetype;
            file.size = fileData.size;
            file.uploadDate = new Date();
            await this.fileRepository.save(file);

            await s3.upload({
                Bucket: 'your-bucket-name',
                Key: oldFileName,
                Body: fileData.buffer,
                ContentType: fileData.mimetype,
            }).promise();
        }
    }
}
