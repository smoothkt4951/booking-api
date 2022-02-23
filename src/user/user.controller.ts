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
  @UseGuards(JwtAuthGuard)
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

  //

  // @Post('/avatar/upload')
  // @UseInterceptors(FileInterceptor('file', upload.single('file')))
  // async uploadImage(
  //   @Session() session,
  //   @UploadedFile() file,
  //   @Query(ValidationPipe) uploadAvatarDto: UploadAvatarDto,
  // ) {
  //   const result = await this.userService.uploadAvatar(
  //     session.images,
  //     file,
  //     uploadAvatarDto,
  //   );
  //   // if (!(result as Product).titleUrl) {
  //   //   session.images = result;
  //   // }

  //   return result;
  // }
  // @Post('/upload/image')
  // @UseInterceptors(FileInterceptor('image'))
  // async uploadedFile(@UploadedFile() file) {
  //   // const response = {
  //   //   originalname: file.originalname,
  //   //   filename: file.filename,
  //   // };
  //   console.log(file);
  //   return file;
  // }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Post('avatar/upload')
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
    // @Req() req,
    @Res() res,
    @Body() body,
  ) {
    console.log({ body });
    // const file = req.file;
    console.log(file);
    if (file) {
      const cloudinaryFile = await this.cloudinaryService.uploadImage(
        `./uploads/${file.filename}`,
      );
      console.log({ cloudinaryFile });
      return res.status(200);
      // return this.userService.saveAvatar(cloudinaryFile, body.user_id);

      // res.send(cloudinaryFile.url);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send(`Cant uploads img`);
    }
  }
}
