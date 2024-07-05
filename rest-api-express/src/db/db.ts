import * as dotenv from 'dotenv'

import {DataSource} from "typeorm";
import {User} from "../feature/user/entity/user.entity";
import {Device} from "../feature/device/entity/device.entity";
import {File} from "../feature/auth/file/entity/file.entity";


dotenv.config()



export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [
        User,
        Device,
        File,
    ],
    driver: require('mysql2')
});


