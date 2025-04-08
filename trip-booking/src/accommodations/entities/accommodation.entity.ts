/* eslint-disable prettier/prettier */
import { AbstactEntity } from "src/database/AbstractEntity"
import { MyLocation } from "src/locations/location";
import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm"

@Entity()
export class Accommodation extends AbstactEntity<Accommodation> {
    @Column()
    owner: string;

    @Column()
    name: string;

    @Column(() => MyLocation)
    location: MyLocation;

    @OneToMany(() => Room, (room) => room.accommodation, { cascade: true })
    myRooms: Room[];

    @ManyToMany(() => User, (users) => users.accommHistory)
    @JoinTable()
    appliedUsers: User[];

    @CreateDateColumn()
    arivalDate: Date;

    @CreateDateColumn()
    departureDate: Date;
}
