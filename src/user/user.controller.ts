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
  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  // user + admin - @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findUserBy(id);
  }

  // admin
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  // admin
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(id, body);
  }
  // admin
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }

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
      const cloudinaryFile = await this.cloudinaryService.uploadImage(
        `./uploads/${file.filename}`,
        file,
      );
      // console.log({ cloudinaryFile });
      // return res.status(200);
      return this.userService.saveAvatar(cloudinaryFile, body.user_id);
    } else {
      // res.status(HttpStatus.BAD_REQUEST).send(`Cant uploads img`);
      return;
    }
  }
}
