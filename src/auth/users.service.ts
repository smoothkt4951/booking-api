import { Injectable } from '@nestjs/common';

import { User } from './user.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return 'Success create user';
  }

  async findOneBy(condition) {
    return await this.userRepository.findOne(condition);
  }

  async update(id: number, data) {
    return await this.userRepository.update(id, data);
  }
}
