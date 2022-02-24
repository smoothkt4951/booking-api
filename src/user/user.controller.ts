import { ImagesHelper } from './../cloudinary/image.helper';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { UserEntity } from 'src/user/user.entity';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  Session,
  UploadedFile,
  Query,
  ValidationPipe,
  Res,
  Req,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
// import multer from 'multer';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
// const storage = multer.memoryStorage();
// const upload = multer({ storage: multer.memoryStorage() });

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // admin
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    if (!users) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(users);
    return users;
  }

  @Get('/test')
  async test() {
    const users = await this.userService.findAllUsers();
    if (!users) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(users);
    return users;
  }

  // user + admin - @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUserBy(id);
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(user);
    return user;
  }

  // admin
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const createdUser = await this.userService.createUser(body);
    if (!createdUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(createdUser);
    return createdUser;
  }

  // user
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    const updatedUser = await this.userService.updateUser(id, body);
    if (!updatedUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(updatedUser);
    return updatedUser;
  }
  // admin
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const removedUser = await this.userService.removeUser(id);
    if (!removedUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(removedUser);
    return removedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('avatar/upload/')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: ImagesHelper.destinationPath,
        filename: ImagesHelper.customFileName,
      }),
      fileFilter: ImagesHelper.fileFilter,
      limits: { fileSize: 1024 * 1024 },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log({ body });
    console.log(body.user_id);
    if (file) {
      const cloudinaryFile = await this.cloudinaryService
        .uploadImage(`./uploads/${file.filename}`, file)
        .catch((err) => {
          throw new HttpException(
            {
              message: err.message,
            },
            HttpStatus.BAD_REQUEST,
          );
        });
      console.log({ cloudinaryFile });
      const cloudUrl = {
        url: cloudinaryFile.url,
        original_filename: cloudinaryFile.original_filename,
      };
      return this.userService.saveAvatar(cloudUrl, body.user_id);
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
