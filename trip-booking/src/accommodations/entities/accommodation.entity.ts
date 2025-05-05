/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { AbstactEntity } from "src/database/AbstractEntity"
import { MyLocation } from "src/locations/location";
import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm"

@Entity()
export class Accommodation extends AbstactEntity<Accommodation> {
    @IsNotEmpty()
    @Column()
    owner: string;

    @IsNotEmpty()
    @Column()
    name: string;

    @IsNotEmptyObject()
    @Column(() => MyLocation)
    location: MyLocation;

    @OneToMany(() => Room, (room) => room.accommodation, { cascade: true })
    myRooms: Room[];

    @ManyToMany(() => User, (users) => users.accommHistory)
    @JoinTable()
    appliedUsers: User[];

    @Column({default: null})
    arivalDate: Date;

    @Column({default: null})
    departureDate: Date;
}
