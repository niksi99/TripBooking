/* eslint-disable prettier/prettier */
import { DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class AbstactEntity<T> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @DeleteDateColumn() 
    deletedAt?: Date

    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }
}