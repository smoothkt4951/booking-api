import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findAllUsers() {
        const users = await this.userRepository.find();
        console.log(users);
        return users;
    }

    async findUserBy(condition) {
        const user = await this.userRepository.findOne(condition);
        return user;
    }

    async createUser({ firstname, lastname, email, password }: CreateUserDto) {
        const user = new UserEntity(firstname, lastname, email, password);
        const createUser = await this.userRepository.create(user);
        console.log(createUser);
        if (!createUser) {
            throw new NotFoundException(`Cant create user`);
        }
        return this.userRepository.save(createUser);
    }

    async updateUser(id, body) {
        const updateUser = await this.userRepository.update(id, body);
        if (!updateUser) {
            throw new NotFoundException(`Cant update userinfo`);
        }
        return updateUser;
    }

    async removeUser(id) {
        const removeUser = await this.userRepository.delete(id);
        if (!removeUser) {
            throw new NotFoundException(`Cant rm user`);
        }
        return removeUser;
    }
}
