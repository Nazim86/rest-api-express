import {injectable} from "inversify";
import {Repository} from "typeorm";
import {AppDataSource} from "../../../../db/db";
import {File} from "../entity/file.entity";

@injectable()
export class FileRepository {
    private fileRepository: Repository<File>;

    constructor() {
        this.fileRepository = AppDataSource.getRepository(File);
    }


    async saveFileInfo(file: File) {
        return await this.fileRepository.save(file)
    }

    async listFiles(page: number, listSize: number) {
        const skip = (page - 1) * listSize
        return this.fileRepository.createQueryBuilder('file')
            .skip(skip)
            .take(listSize)
            .getMany()
    }

    async getFile(id: string) {
        return await this.fileRepository.findOne({where: {id}})
    }

    async deleteFile(key: string) {
       return this.fileRepository
            .createQueryBuilder('file')
            .where('file.key=:key', {key})
            .delete()
            .execute()
    }

}
