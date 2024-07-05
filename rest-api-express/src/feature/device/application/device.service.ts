import {ResultCode} from "../../../error-handler/result-code-enum";
import {injectable} from "inversify";
import {DeviceRepository} from "../db/device.repository";


@injectable()
export class DeviceService {


    constructor(private readonly deviceRepository: DeviceRepository) {
    }


    async deleteDevice(deviceId: string, userId: string) {
        const device = await this.deviceRepository.findDeviceById(deviceId);

        if (device && device.userId !== userId) {
            return {
                data: false,
                code: ResultCode.Forbidden
            }
        }

        const isDeleted = await this.deviceRepository.deleteDevice(deviceId, userId);


        return {
            data: isDeleted,
            code: isDeleted ? ResultCode.Success : ResultCode.NotFound
        }
    }
}



