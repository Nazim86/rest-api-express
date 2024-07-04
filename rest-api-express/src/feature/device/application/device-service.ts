
import {ResultCode} from "../../../error-handler/result-code-enum";
import {injectable} from "inversify";
import {DeviceRepository} from "../db/device.repository";


@injectable()
export class DeviceService {


    constructor(private readonly deviceRepository: DeviceRepository) {
    }



    // async getDevices(ip: string, userId: string): Promise<DeviceViewType[]> {
    //     return await this.tokenInDbRepository.getDevices(ip, userId)
    //
    // }
    //
    // async updateDevice(refreshToken: string): Promise<boolean> {
    //     const {
    //         deviceId,
    //         lastActiveDate
    //     } = await this.jwtService.getTokenMetaData(refreshToken, settings.REFRESH_TOKEN_SECRET)
    //
    //     return await this.tokenInDbRepository.updateDevice(deviceId, lastActiveDate)
    //
    // }
    //
    // async deleteDevices(deviceId: string): Promise<boolean> {
    //     return await this.tokenInDbRepository.deleteDevices(deviceId);
    // }
    //
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



