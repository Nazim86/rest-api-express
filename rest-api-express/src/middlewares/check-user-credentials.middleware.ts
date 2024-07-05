import {NextFunction, Request, Response} from "express";
import {User} from "../feature/user/entity/user.entity";
import {AppDataSource} from "../db/db";


export const checkUserCredentialsMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.body.id;


    const userRepository = AppDataSource.getRepository(User);

    const checkCredentials = await userRepository.findOneBy({id})

    if (checkCredentials) {
        res.status(400).send("This user exists in the system")
    }
    else {
        next()
    }

}