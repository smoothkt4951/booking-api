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
import { UpdateUserInfoDto } from 'src/user/dto/update-userInfo.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllUsers() {
    return await this.userRepository.find().catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  async findUserBy(condition) {
    return await this.userRepository.findOne(condition).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
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

    return await this.userRepository.save(createUser).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  async updateUser(id, body: UpdateUserInfoDto) {
    return await this.userRepository.update(id, body).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  async removeUser(id) {
    const user = await this.userRepository.findOne(id);
    const removeAvatar = await this.cloudinaryService.deleteOldAvatar(
      user.avatarUrl,
    );

    const removeUser = await this.userRepository.delete(id).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    return removeUser;
  }
  async saveAvatar(cloudUrl: UploadAvatarDto, user_id) {
    // console.log({ avatarUrl });
    const savedAvatar = await this.userRepository
      .update({ id: user_id }, { avatarUrl: cloudUrl.url })
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });

    return savedAvatar;
  }
}
