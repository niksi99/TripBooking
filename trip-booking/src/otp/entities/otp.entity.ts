/* eslint-disable prettier/prettier */

import { AbstactEntity } from "src/database/AbstractEntity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { OTPType } from "../types/otp.type";

@Entity()
export class OTP extends AbstactEntity<OTP>{
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    token: string; //hashed otp for verification

    @Column({ type: 'enum', enum: OTPType })
    type: OTPType;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}