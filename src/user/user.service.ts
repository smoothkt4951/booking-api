import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: [{ id: id }],
    });
    return user;
  }

  async createUser(body) {
    const createUser = await this.userRepository.create(body);
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
