import {Request, Response, NextFunction} from "express";
import {container} from "../composition-root";
import {UserService} from "../feature/user/application/user-service";
import {DeviceRepository} from "../feature/device/db/device.repository";
import jwt from "jsonwebtoken";

const userService = container.resolve(UserService)
const deviceRepository  = container.resolve(DeviceRepository)


export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {


        const refreshToken = req.cookies.refreshToken

        if (!req.cookies.refreshToken) {
            return res.sendStatus(401)
        }

        let refreshTokenMetaData

        try {
             refreshTokenMetaData =  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        }
        catch (e) {
            console.log(e)
        }


        if (!refreshTokenMetaData) {
            return res.sendStatus(401)
        }

        const {deviceId, iat, userId} = refreshTokenMetaData

        const getDevice = await deviceRepository.findDevice( deviceId, iat)

        if (!getDevice) {
            return res.sendStatus(401)
        }
        req.context = {}
        req.context.user = await userService.findUserById(userId)
        return next()
    }

