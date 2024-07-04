import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {injectable} from "inversify";
import {UserRepository} from "../../user/db/user.repository";
import {UserService} from "../../user/application/user-service";
import {randomUUID} from "crypto";
import {Device} from "../../device/entity/device.entity";
import {DeviceRepository} from "../../device/db/device.repository";


@injectable()
export class AuthService {


    constructor(private readonly userRepository: UserRepository,
               private readonly userService: UserService,
                private readonly deviceRepository: DeviceRepository,
                ) {

    }

    async validateUser(id: string, password: string): Promise<any> {
        const user = await this.userService.findUserById(id);
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            return user;
        }
        return null;
    }

    async userInfo(id:string){
        return this.userRepository.findUserById(id)
    }

    async getTokenMetaData(refreshToken:string){
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    }

    async login(userId: string, title: string | undefined): Promise<{ accessToken: string; refreshToken: string }> {

        const deviceId = randomUUID();


        const {accessToken, refreshToken} = await this.createTokens(
            userId,
            deviceId,
        );

        // decode token to take iat and exp
        const {iat, exp} = jwt.decode(refreshToken);

        //deviceDto
        const newDevice = {
            id: deviceId,
            userId,
            title,
            lastActiveDate: iat,
            expirationDate: exp,
        };

        const createdDevice = await Device.createDevice(newDevice);

        await this.deviceRepository.saveDevice(createdDevice)

        return {accessToken,refreshToken}
    }


    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {

            const payload: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

        const device = await this.deviceRepository.findDeviceById(payload.deviceId)

        if (device instanceof Device) {
            device.lastActiveDate = payload.lastActiveDate
            await this.deviceRepository.saveDevice(device)
        }


        return this.createTokens(payload.userId, payload.deviceId);
    }



    private async createTokens(userId:string, deviceId: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.createAccessToken(userId,deviceId),
            this.createRefreshToken(userId, deviceId),
        ]);
        return {accessToken, refreshToken};
    }

    private async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        return jwt.sign(
            {
                userId,
                deviceId,
            },
            process.env.JWT_REFRESH_SECRET,{expiresIn: '7d'},
        );
    }

    private async createAccessToken(userId: string,deviceId: string): Promise<string> {
        return jwt.sign(
            {userId,deviceId},
            process.env.JWT_SECRET,{
                expiresIn: '10d', //TODO: change to 10min
            },
        );
    }


}



