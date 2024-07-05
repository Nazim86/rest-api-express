import { injectable } from "inversify";
import { Repository } from "typeorm";
import {AppDataSource} from "../../../db/db";
import {Inject} from "@nestjs/common";
import {File} from "../entity/file.entity";

@injectable()
export class FileRepository {
    @Inject(File)private fileRepository: Repository<File>;

    constructor() {
        this.fileRepository = AppDataSource.getRepository(File);
    }



    async saveFileInfo(file:File) {
        return await this.fileRepository.save(file)
    }

    async listFiles(page: number, listSize: number) {
        console.log(listSize)
        const skip = (page - 1) * listSize
        return this.fileRepository.createQueryBuilder('file')
            .skip(skip)
            .take(listSize)
            .getMany()
    }

    async getFile(id: string) {
        return await this.fileRepository.findOne({where:{id}})
    }
    //
    // async deleteFile(id: number) {
    //     const file = await this.fileRepository.findOneBy({ id });
    //     if (file) {
    //         await this.fileRepository.remove(file);
    //         await s3.deleteObject({
    //             Bucket: 'your-bucket-name',
    //             Key: file.name,
    //         }).promise();
    //     }
    // }
    //
    // async updateFile(id: number, fileData) {
    //     const file = await this.fileRepository.findOneBy({ id });
    //     if (file) {
    //         const oldFileName = file.name;
    //
    //         file.name = fileData.originalname;
    //         file.extension = fileData.mimetype.split('/')[1];
    //         file.mimeType = fileData.mimetype;
    //         file.size = fileData.size;
    //         file.uploadDate = new Date();
    //         await this.fileRepository.save(file);
    //
    //         await s3.upload({
    //             Bucket: 'your-bucket-name',
    //             Key: oldFileName,
    //             Body: fileData.buffer,
    //             ContentType: fileData.mimetype,
    //         }).promise();
    //     }
    // }
}
