import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn} from "typeorm"
import {User} from "../../user/entity/user.entity";

@Entity()
export class File {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    extension: string

    @Column()
    mimeType: string

    @Column()
    url: string

    @Column()
    size: number

    @Column()
    uploadDate: Date

    @ManyToOne(() => User, user => user.files)
    user: User
}