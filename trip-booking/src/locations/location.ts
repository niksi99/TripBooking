/* eslint-disable prettier/prettier */
import { Column } from "typeorm";

export class MyLocation {
    @Column()
    label: string;

    @Column('double')
    lat: number;

    @Column('double')
    lng: number;

    @Column()
    city: string;
}