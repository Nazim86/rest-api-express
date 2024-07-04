import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Device {
    @PrimaryColumn({type:'uuid'})
    id: string

    @Column({ type: 'varchar' })
    title: string

    @Column({ type: 'varchar' })
    userId: string

    @Column({ type: 'bigint' })
    lastActiveDate: number

    @Column({ type: 'bigint' })
    expirationDate: number

    static createDevice(newDevice:any): Device {
       const device = new Device()
        device.id = newDevice.id
        device.userId = newDevice.userId
        device.title = newDevice.title
        device.lastActiveDate = newDevice.lastActiveDate
        device.expirationDate = newDevice.expirationDate

        return device;
    }


}