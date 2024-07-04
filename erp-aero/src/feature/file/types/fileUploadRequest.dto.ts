import {FileType} from "./fileType.enum";

export class FileUploadRequest {
  id?: string;
  userId?: string;
  name: string;
  buffer: Buffer;
  format: string;
  fileType: FileType;
  ownerId?: string;
  expirationDate?: Date;
}
