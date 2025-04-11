/* eslint-disable prettier/prettier */
import { InjectRepository } from "@nestjs/typeorm";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource, Repository } from "typeorm";

export class UserRepository extends Repository<User> {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(User) 
        private userRepository: Repository<User>,
    ) {
            super(
                userRepository.target,
                userRepository.manager,
                userRepository.queryRunner
            );
        }
    
        public async getAll() : Promise<User[]> {
            return await this.userRepository.find({
                withDeleted: true
            });
        }

        public async getUserById(id: string): Promise<User | null> {
            return await this.findOne({
                where: {id: id},
                withDeleted: true
            });
        }

        public async getUserByEmail(email: string): Promise<User | null> {
            return await this.userRepository.findOne({
                where: {email: email},
                withDeleted: true
            });
        }

        public async getUserByUsername(username: string): Promise<User | null> {
            return await this.userRepository.findOne({
                where: {username: username},
                withDeleted: true
            });
        }

        public async getUserByEmailOrUsername(email: string, username: string): Promise<User | null> {
            return await this.manager.findOne(User, {
              where: [
                { email },
                { username },
              ],
              withDeleted: true
            });
        }

        public async hardDeleteUser(id: string) {
            return await this.userRepository.delete({id: id});
        }
        
        public async softDeleteUser(user: User) {
            return await this.userRepository.softRemove(user);
        }
        
        public async softUndeleteUser(id: string){
            return await this.userRepository.restore(id);
        }

        async hardDeleteUserAndOwnedAccommodations(user: User): Promise<void> {

            await this.dataSource.transaction(async (manager) => {
            const deleteAccommodationsResult = await manager
                .createQueryBuilder()
                .delete()
                .from(Accommodation)
                .where('owner = :username', { username: user.username })
                .execute();
        
            if (deleteAccommodationsResult.affected === 0) {
                throw new Error(`No accommodations found for user: ${user.username}`);
            }

            const userId = user.id;
              await manager
                .createQueryBuilder()
                .delete()
                .from(User)
                .where('id = :userId', { userId })
                .execute();
            });
          }
}