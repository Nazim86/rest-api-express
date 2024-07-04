import {User} from "../feature/user/entity/user.entity";


declare global{
     namespace Express{
        export interface Request{
            context:{
                user?:User|null
            }
        }
    }
}
