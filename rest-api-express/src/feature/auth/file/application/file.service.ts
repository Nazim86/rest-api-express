import {injectable} from "inversify";
import {S3StorageAdapter} from "../../../amazonS3/s3-storage-adapter.service";
import {File} from "../entity/file.entity";
import {FileRepository} from "../db/file.repository";
import {ResultCode} from "../../../../error-handler/result-code-enum";

@injectable()
export class FileService {

    constructor( private readonly s3Service: S3StorageAdapter,
                private readonly fileRepository: FileRepository) {
    }


    async uploadFile(userId: string, fileData) {

        const uploadedFile = await this.s3Service.uploadFile(userId, fileData)



        const file = new File();
        file.id = uploadedFile.fileId!;
        file.url = uploadedFile.url;
        file.key = uploadedFile.key;
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

    async getFile(id: string) {
        return await this.fileRepository.getFile(id)
    }

    async downloadFile(fileKey:string){
        return await this.s3Service.downloadFile(fileKey)
    }

    async deleteFile(key: string) {

        await this.s3Service.deleteFile(key)

        return this.fileRepository.deleteFile(key)
    }


    async updateFile(id:string,userId: string, fileData) {

        const uploadedFile = await this.s3Service.uploadFile(userId, fileData)

        const file = await this.fileRepository.getFile(id)
        if (!file){
            return {code:ResultCode.NotFound, message:"File not found"}
        }

        file.url = uploadedFile.url;
        file.name = fileData.originalname;
        file.extension = fileData.mimetype.split('/')[1];
        file.mimeType = fileData.mimetype;
        file.size = fileData.size;
        file.updatedAt = new Date();

        return this.fileRepository.saveFileInfo(file);


    }
}
