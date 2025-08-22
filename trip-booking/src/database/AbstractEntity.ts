/* eslint-disable prettier/prettier */
import { Column, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class AbstactEntity<T> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @DeleteDateColumn() 
    deletedAt?: Date

    @Column({default: false})
    softDeletedByAdministrator: boolean

    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }
}