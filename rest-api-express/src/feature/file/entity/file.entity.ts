import {Entity, Column, ManyToOne, PrimaryColumn} from "typeorm"
import {User} from "../../user/entity/user.entity";

@Entity()
export class File {
    @PrimaryColumn({type:"varchar",unique:true})
    id: string;

    @Column({type:"varchar"})
    name: string;

    @Column({type:"varchar"})
    extension: string;

    @Column({type:"varchar"})
    mimeType: string;

    @Column({type:"varchar"})
    url: string;

    @Column({type:"varchar"})
    key: string;

    @Column({type:'int'})
    size: number;

    @Column({type:'date'})
    uploadDate: Date

    @Column({type:'date',nullable:true})
    updatedAt: Date

    @ManyToOne(() => User, user => user.files)
    user: User
}