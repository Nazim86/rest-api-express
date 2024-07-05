import { Request, Response } from "express";
import { injectable } from "inversify";
import {FileService} from "../application/file.service";
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


    async deleteFile(req: Request, res: Response) {
        const id = req.params.id
        const file = await this.fileService.getFile(id);

        if (!file) {
            return res.status(404).send("File not found.");
        }

        const isDeleted = await this.fileService.deleteFile(file.key)
        if(isDeleted.affected!==1) {
            return res.status(404).send("File not found.");

        }
        return res.status(204).send()
    }


    async downloadFile(req: Request, res: Response) {
        const id = req.params.id
        const file = await this.fileService.getFile(id);
        if (!file) {
            return res.status(404).send("File not found.");
        }

        const { Body, ContentType, ContentLength } = await this.fileService.downloadFile(file.key)

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

