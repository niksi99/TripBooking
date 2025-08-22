/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNotEmptyObject, Length } from "class-validator";
import { AbstactEntity } from "../../database/AbstractEntity";
import { MyLocation } from "../../locations/location";
import { Room } from "../../rooms/entities/room.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm"

@Entity()
export class Accommodation extends AbstactEntity<Accommodation> {
    @ManyToOne(() => User, (user) => user.ownedAccommodations, { onDelete: 'CASCADE' })
    @IsNotEmpty({ message: 'Owner is required.' })
    owner: User;

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

    @Column({default: false})
    softDeletedByAccommodationOwner: boolean    
}
