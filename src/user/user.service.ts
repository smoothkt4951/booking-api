import { Observable } from 'rxjs';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Repository, getConnection } from 'typeorm';
import { UserEntity } from './user.entity';
// import * as cloudinary from 'cloudinary';
// import * as streamifier from 'streamifier';
// import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
    const userEmail = await this.findUserBy({ email });
    if (userEmail) {
      throw new HttpException(
        'Email are taken!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
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
  async saveAvatar(avatarUrl, user_id) {
    // console.log(user_id);

    // const savedAvatar = await getConnection()
    //   .createQueryBuilder()
    //   .update(UserEntity)
    //   .set({ avatarUrl: avatarUrl })
    //   .where('id = :id', { id: user_id })
    //   .execute();

    const savedAvatar = await this.userRepository.update(
      { id: user_id },
      { avatarUrl: avatarUrl },
    );
    if (!savedAvatar) {
      throw new NotFoundException(`Cant update userinfo`);
    }
    return savedAvatar;

    // user_id
    // return avatarUrl;
  }
}
