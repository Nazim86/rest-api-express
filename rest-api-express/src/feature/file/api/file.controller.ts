import { Request, Response } from "express";
import { injectable } from "inversify";
import {FileService} from "../application/file-service";
import {Readable} from "node:stream";

@injectable()
export class FileController {
    constructor(
         private readonly fileService: FileService
    ) {}

    async uploadFile(req: Request, res: Response) {
        const fileData = req.file;
        const user = req.context.user!

        if (!fileData) {
            return res.status(400).send("No file uploaded.");
        }
        const file = await this.fileService.uploadFile(user.id,fileData);
        return res.status(201).send(file);
    }

    async listFiles(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const listSize = parseInt(req.query.listSize as string) || 10;
        const files = await this.fileService.listFiles(page, listSize);
        return res.send(files);
    }

    async getFile(req: Request, res: Response) {
        const id = req.params.id
        const file = await this.fileService.getFile(id);
        if (!file) {
            return res.status(404).send("File not found.");
        }
        return res.send(file);
    }

    async updateFile(req: Request, res: Response) {
        const id = req.params.id

        const user =   req.context.user!
        const fileData = req.file;

        if (!fileData) {
            return res.status(400).send("No file uploaded.");
        }

        const file = await this.fileService.updateFile(id,user.id, fileData);
        return res.status(200).send(file);
    }

    //
    // async deleteFile(req: Request, res: Response) {
    //     const id = parseInt(req.params.id);
    //     await this.fileService.deleteFile(id);
    //     res.status(204).send();
    // }
    //
    //
    async downloadFile(req: Request, res: Response) {
        const id = req.params.id
        const file = await this.fileService.getFile(id);

        if (!file) {
            return res.status(404).send("File not found.");
        }

        const { Body, ContentType, ContentLength } = await this.fileService.downloadFile(file)

        if (Body instanceof Readable) {
            res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
            res.setHeader('Content-Type', ContentType);
            res.setHeader('Content-Length', ContentLength);

            Body.pipe(res);
        } else {
            throw new Error('Неожиданный тип тела ответа');
        }

        return
    }
}


// fileData in fileService {
//     fieldname: 'file',
//         originalname: 'Screenshot 2024-06-26 at 00.08.26.png',
//         encoding: '7bit',
//         mimetype: 'image/png',
//         size: 40903,
//         bucket: 'funny-team',
//         key: 'Screenshot 2024-06-26 at 00.08.26.png',
//         acl: 'public-read',
//         contentType: 'application/octet-stream',
//         contentDisposition: null,
//         contentEncoding: null,
//         storageClass: 'STANDARD',
//         serverSideEncryption: null,
//         metadata: undefined,
//         location: 'https://funny-team.s3.eu-north-1.amazonaws.com/Screenshot%202024-06-26%20at%2000.08.26.png',
//         etag: '"6dbf863763c9afe61f2bb413985ed51f"',
//         versionId: undefined
// }
