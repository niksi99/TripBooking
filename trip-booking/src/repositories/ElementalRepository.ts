/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ObjectLiteral, Repository } from "typeorm";

export class ElementalRepository<T extends ObjectLiteral> {
    [x: string]: any;
    constructor(
        protected readonly repository: Repository<T>) {}

    public async getAll(): Promise<T[]> {
        return await this.repository.find({
            withDeleted: true
        });
      }
    
    public async getById(id: string): Promise<T | null> {
        return await this.findOne({
            where: {id: id},
            withDeleted: true
        })
    }

    public async hardDelete(id: string): Promise<void> {
        return await this.delete({id: id});
    }
    
    public async softDelete(element: T): Promise<void> {
        await this.repository.softRemove(element);
    }
    
    public async softUndelete(id: string): Promise<void>{
        await this.repository.restore(id);
    }

    async saveEntity(entity: T) {
        return await this.repository.save(entity);
    }
}