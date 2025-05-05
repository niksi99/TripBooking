/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Role } from "src/auth/enums/role.enum";
import { AbstactEntity } from "src/database/AbstractEntity";
import { BeforeInsert, Column, Entity, ManyToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";
import { IsAllowedRole } from "src/validators/IsRoleAllowrdValidator";

@Entity()
export class User extends AbstactEntity<User>{

    @Length(2, 30, { message: 'First name must be between 2 and 30 characters.' })
    @IsNotEmpty({ message: 'First name is required.' })
    @Column()
    firstName: string;

    @Length(2, 40, { message: 'Last must be between 2 and 40 characters.' })
    @IsNotEmpty({ message: 'Last name is required.' })
    @Column()
    lastName: string;

    @Length(5, 40, { message: 'Username must be between 5 and 40 characters.' })
    @IsNotEmpty({ message: 'Username is required.' })
    @Column({ unique: true })
    username: string;

    @IsEmail({}, { message: 'Email must be a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    @Column({ unique: true })
    email: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    //     message: 'Password must include uppercase, lowercase, number, and special character.',
    // })
    @Column()
    password: string;

    @IsNotEmpty({ message: 'Role is required.' })
    @IsAllowedRole({
        groups: [
            Role.ACCOMMODATION_OWNER,
            Role.ADMINISTRATOR, 
            Role.GUIDE, 
            Role.PASSENGER
        ] as string[], 
        message: `Unidentified Role. Please try again.`, 
    })
    @Column({
        type: 'enum',
        enum: Role,
    })
    role: Role

    @ManyToMany(() => Accommodation, (accomm) => accomm.appliedUsers)
    accommHistory: Accommodation[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
