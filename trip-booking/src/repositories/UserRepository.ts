/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>) {
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
            return await this.userRepository.findOneBy({
                email: email,
            });
        }

        public async getUserByUsername(username: string): Promise<User | null> {
            return await this.userRepository.findOneBy({
                username: username
            });
        }

        public async getUserByEmailOrUsername(email: string, username: string): Promise<User | null> {
            return await this.manager.findOne(User, {
              where: [
                { email },
                { username },
              ],
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
}