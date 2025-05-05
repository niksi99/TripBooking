/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Role } from "src/auth/enums/role.enum";
import { AbstactEntity } from "src/database/AbstractEntity";
import { BeforeInsert, Column, Entity, ManyToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity()
export class User extends AbstactEntity<User>{
    @IsNotEmpty()
    @Column()
    firstName: string;

    @IsNotEmpty()
    @Column()
    lastName: string;

    @IsNotEmpty()
    @Column({ unique: true })
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @Column({ unique: true })
    email: string;

    @IsNotEmpty()
    @Column()
    password: string;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Role,
    })
    role: Role

    @ManyToMany(() => Accommodation, (accomm) => accomm.appliedUsers)
    accommHistory: Accommodation[];

    @BeforeInsert()
    async hashPassword() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.password = await bcrypt.hash(this.password, 10);
    }
}
