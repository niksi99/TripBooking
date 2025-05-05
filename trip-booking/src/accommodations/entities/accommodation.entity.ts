/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNotEmptyObject, Length } from "class-validator";
import { AbstactEntity } from "src/database/AbstractEntity"
import { MyLocation } from "src/locations/location";
import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm"

@Entity()
export class Accommodation extends AbstactEntity<Accommodation> {
    @IsNotEmpty({ message: 'Owner is required.' })
    @Column()
    owner: string;

    @IsNotEmpty({ message: 'Name is required.' })
    @Length(2, 25, { message: 'Last must be between 2 and 25 characters.' })
    @Column()
    name: string;

    @IsNotEmptyObject({}, { message: 'Location is required.' })
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
