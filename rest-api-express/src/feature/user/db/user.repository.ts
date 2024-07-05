import {injectable} from "inversify";
import {User} from "../entity/user.entity";
import {Repository} from "typeorm";
import {AppDataSource} from "../../../db/db";

@injectable()
export class UserRepository {
     private userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }


    async save(user: User) {
        return await this.userRepo.save(user);
    }


    async findUserById(id: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } });

    }
}

