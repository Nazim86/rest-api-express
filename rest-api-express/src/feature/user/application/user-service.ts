import bcrypt from 'bcrypt';

import {UserRepository} from "../db/user.repository";
import {injectable} from "inversify";
import {User} from "../entity/user.entity";


@injectable()
export class UserService{

    constructor(private readonly userRepository: UserRepository) {

    }

     async createNewUser(id: string, password: string): Promise<User> {


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.createUser(id, hashedPassword);
         return await this.userRepository.save(user)

    }


    // async deleteUser(id: string): Promise<boolean> {
    //     return await this.userRepository.deleteUser(id)
    // }


    async findUserById (id:string):Promise<User |null>{
        return this.userRepository.findUserById(id);

    }
}
