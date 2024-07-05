import "reflect-metadata"

import {AuthService} from "./feature/auth/application/auth.service";
import {UserService} from "./feature/user/application/user-service";
import {UserRepository} from "./feature/user/db/user.repository";

import {DeviceService} from "./feature/device/application/device.service";
import {AuthController} from "./feature/auth/api/auth.controller";
import {Container} from "inversify";
import {DeviceRepository} from "./feature/device/db/device.repository";
import {S3StorageAdapter} from "./feature/amazonS3/s3-storage-adapter.service";
import {FileController} from "./feature/auth/file/api/file.controller";
import {FileService} from "./feature/auth/file/application/file.service";
import {FileRepository} from "./feature/auth/file/db/file.repository";



export const container = new Container()


container.bind(AuthService).toSelf()
container.bind<AuthController>(AuthController).toSelf();
container.bind(UserService).toSelf()
container.bind(UserRepository).toSelf()
container.bind(DeviceService).toSelf()
container.bind(DeviceRepository).toSelf()
container.bind(S3StorageAdapter).toSelf()
container.bind(FileController).toSelf()
container.bind(FileService).toSelf()
container.bind(FileRepository).toSelf()


























