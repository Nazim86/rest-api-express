import {Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {File} from "../../file/entity/file.entity";


@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    passwordHash: string

    @OneToMany(() => File, file => file.user)
    files: File[]

    static createUser(id: string, passwordHash: string): User {
        const newUser: User = new User()
        newUser.id = id
        newUser.passwordHash=passwordHash

        return newUser;
    }

}
// module.exports = { User };