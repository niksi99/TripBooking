/* eslint-disable prettier/prettier */
import { Role } from "src/auth/enums/role.enum";
import { AbstactEntity } from "src/database/AbstractEntity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity()
export class User extends AbstactEntity<User>{
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
    })
    role: Role

    @BeforeInsert()
    async hashPassword() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.password = await bcrypt.hash(this.password, 10);
    }
}
