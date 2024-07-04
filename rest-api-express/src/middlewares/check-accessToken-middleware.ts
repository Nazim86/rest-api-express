import {Request, Response, NextFunction} from "express";
import {container} from "../composition-root";
import {UserRepository} from "../feature/user/db/user.repository";
import jwt from "jsonwebtoken";
import {DeviceRepository} from "../feature/device/db/device.repository";

const userRepository = container.resolve(UserRepository)
const deviceRepository  = container.resolve(DeviceRepository)

export const  checkAccessTokenMiddleware =  async (req: Request, res: Response, next: NextFunction)=> {

        if (!req.headers.authorization) {
            res.sendStatus(401)
            return
        }


        const accessToken = req.headers.authorization.split(" ")[1]

    let tokenMetaData
    try {
         tokenMetaData = jwt.verify(accessToken, process.env.JWT_REFRESH_SECRET)
    }
        catch (e) {

            console.log(e)
    }

        if (!tokenMetaData ) {
            return res.sendStatus(401);
        }

    const {deviceId, iat, userId} = tokenMetaData

    const getDevice = await deviceRepository.findDevice( deviceId, iat)

    if (!getDevice) {
        return res.sendStatus(401)
    }
        req.context = {}
        req.context.user = await userRepository.findUserById(userId)
        return next()
    }






