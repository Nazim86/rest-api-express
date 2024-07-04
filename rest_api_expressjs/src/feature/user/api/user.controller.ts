import {UserService} from "../application/user-service";
import {Request, Response} from "express";
import {getPaginationValues} from "../../../functions/pagination-values";
import {injectable} from "inversify";
import {ResultCode} from "../../../error-handler/result-code-enum";

@injectable()
export class UserController {

    constructor(
                protected userService: UserService) {
    }


    async signup(req: Request, res: Response): Promise<void> {
        const { id, password } = req.body;

        const newUser = await this.userService.createNewUser(id, password)
        res.status(201).send(newUser)

    }

    // async getUsers(req: Request, res: Response) {
    //
    //     const {
    //         sortBy,
    //         sortDirection,
    //         pageNumber,
    //         pageSize,
    //         searchLoginTerm,
    //         searchEmailTerm
    //     } = getPaginationValues(req.query)
    //
    //     const getUsers = await this.userQueryRepo.getUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
    //     res.status(200).send(getUsers)
    // }




    // async deleteUser(req: Request, res: Response) {
    //
    //     const id = req.params.id
    //
    //     const deleteUser = await this.userService.deleteUser(id)
    //
    //     if (!deleteUser) {
    //         return res.sendStatus(404)
    //     }
    //     res.sendStatus(204)
    // }
}