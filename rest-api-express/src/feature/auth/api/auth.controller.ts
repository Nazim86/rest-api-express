import {AuthService} from "../application/auth.service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {UserService} from "../../user/application/user-service";
import {HttpStatus} from "@nestjs/common";
import {DeviceService} from "../../device/application/device.service";
import {ResultCode} from "../../../error-handler/result-code-enum";

@injectable()
export class AuthController {

    constructor(private readonly authService: AuthService,
                private readonly userService: UserService,
                private readonly deviceService: DeviceService) {
    }


    async signup(req: Request, res: Response) {

        const {id, password} = req.body;

        const newUser = await this.userService.createNewUser(id, password)
        return res.status(201).send(newUser)

    }

    async signin(req: Request, res: Response){
        const {id, password} = req.body;
        const user = await this.authService.validateUser(id, password);
        if (!user) {
            res.status(401).json({message: "Invalid credentials"});
            return;
        }

        const deviceName = req.headers['user-agent'];

        const {accessToken, refreshToken} = await this.authService.login(user.id, deviceName);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict', secure: true,
            //maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).send({accessToken: accessToken, refreshToken: refreshToken});

    }


    async refreshToken(req: Request, res: Response) {

        const token = req.cookies.refreshToken

        const {accessToken, refreshToken} = await this.authService.refreshToken(token)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict', secure: true,
            //maxAge: 24 * 60 * 60 * 1000
        });
       return res.status(200).send({accessToken: accessToken, refreshToken: refreshToken});
    }


    async userInfo(req: Request, res: Response) {

        const getCurrentUser = await this.authService.userInfo(req.context.user!.id)

        if (!getCurrentUser) {
            res.status(HttpStatus.NOT_FOUND).send("User not found")
        }

        return res.status(200).send(getCurrentUser!.id)
    }


    async logout(req: Request, res: Response) {
        const accessToken = req.headers.authorization!.split(" ")[1]

        const {deviceId, userId} = await this.authService.getTokenMetaData(accessToken)

        const result = await this.deviceService.deleteDevice(deviceId, userId)

        if (result.code !== ResultCode.Success) {
            return res.status(result.code)
        }

        try {
            res.clearCookie("refreshToken")
            return res.sendStatus(204)
        } catch (e) {
            return res.sendStatus(401)
        }
    }
}