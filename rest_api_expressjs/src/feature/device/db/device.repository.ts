import {injectable} from "inversify";
import {DataSource, Repository} from "typeorm";
import {User} from "../../user/entity/user.entity";
import {AppDataSource} from "../../../db/db";
import {Device} from "../entity/device.entity";
import {settings} from "../../../settings";

@injectable()
export class DeviceRepository {
    private deviceRepo: Repository<Device>;
    private readonly dataSource: DataSource;

    constructor() {
        this.dataSource = AppDataSource;
        this.deviceRepo = this.dataSource.getRepository(Device);
    }

    async saveDevice(device: Device) {
        return this.deviceRepo.save(device)
    }

    async findDevice(deviceId: string, lastActiveDate: string) {
        return this.dataSource.getRepository(Device)
            .createQueryBuilder('device')
            .where('device.id = :id', { id: deviceId })
            .andWhere('device.lastActiveDate = :lastActiveDate', {lastActiveDate})
            .getOne();

    }

    async findDeviceById(deviceId: string) {
        return this.dataSource.getRepository(Device)
            .createQueryBuilder('device')
            .where('device.id = :id', { id: deviceId })
            .getOne();
    }

    async deleteDevice(deviceId: string, userId: string) {
        return this.dataSource.getRepository(Device)
            .createQueryBuilder('device')
            .delete()
            .where('device.id = :id', { id: deviceId })
            .andWhere('device.userId = :userId', { userId })
            .execute();
    }


}