import { Roles } from 'src/auth/decorators/roles.decorator';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { Roles } from 'src/auth/decorator/roles.decorator';
import { ImagesHelper } from './../cloudinary/image.helper';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
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
  UploadedFile,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { Role } from './user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    if (!users) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(users);
    return users;
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUserBy(id);
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(user);
    return user;
  }

  @Roles(Role.Admin, Role.User)
  @Post()
  async createUser(@Body(ValidationPipe) body: CreateUserDto) {
    const createdUser = await this.userService.createUser(body);
    if (!createdUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(createdUser);
    return createdUser;
  }

  @Put(':id')
  @Roles(Role.Admin, Role.User)
  async updateUser(@Param('id') id: string, @Body(ValidationPipe) body: any) {
    const updatedUser = await this.userService.updateUser(id, body);
    if (!updatedUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(updatedUser);
    return updatedUser;
  }

  @Roles(Role.Admin, Role.User)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const removedUser = await this.userService.removeUser(id);
    if (!removedUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    console.log(removedUser);
    return removedUser;
  }

  @Roles(Role.User, Role.Admin)
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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) body,
  ) {
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
