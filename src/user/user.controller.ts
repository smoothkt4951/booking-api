import { UpdateUserInfoDto } from './dto/update-userInfo.dto';
import { Roles } from 'src/auth/decorators/roles.decorator'
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { Roles } from 'src/auth/decorator/roles.decorator';
import { ImagesHelper } from './../cloudinary/image.helper'
import { CloudinaryService } from './../cloudinary/cloudinary.service'
import { UserService } from './user.service'
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
} from '@nestjs/common'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Express } from 'express'
import { Role } from './entities/user.entity'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  @ApiOkResponse({ description: 'Get all users successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: 'Forbidden. Cant get all users infomations',
  })
  async getAllUsers() {
    const users = await this.userService.findAllUsers()
    if (!users) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cant find All Users',
        },
        HttpStatus.FORBIDDEN,
      )
    }
    return users
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  @ApiOkResponse({ description: 'Get one user by id successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden. Cant get user infomations' })
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUserBy(id)
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cant get User Infomations',
        },
        HttpStatus.FORBIDDEN,
      )
    }
    return user
  }

  @Roles(Role.Admin, Role.User)
  @Post()
  @ApiCreatedResponse({ description: 'Create user successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden. Cant create user' })
  @ApiBody({type: CreateUserDto})
  async createUser(@Body(ValidationPipe) body: CreateUserDto) {
    const createdUser = await this.userService.createUser(body)
    if (!createdUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cant create user',
        },
        HttpStatus.FORBIDDEN,
      )
    }
    console.log(createdUser)
    return createdUser
  }

  @Roles(Role.Admin, Role.User)
  @Put(':id')
  @ApiOkResponse({ description: 'Update user infomations successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: 'Forbidden. Cant update user infomations',
  })
  async updateUser(@Param('id') id: string, @Body(ValidationPipe) body: UpdateUserInfoDto) {
    const updatedUser = await this.userService.updateUser(id, body)
    if (!updatedUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cant update user infomations',
        },
        HttpStatus.FORBIDDEN,
      )
    }
    console.log(updatedUser)
    return updatedUser
  }

  @Roles(Role.Admin, Role.User)
  @Delete(':id')
  @ApiOkResponse({ description: 'Delete user successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden. Cant delete user' })
  async removeUser(@Param('id') id: string) {
    const removedUser = await this.userService.removeUser(id)
    if (!removedUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cant remove user',
        },
        HttpStatus.FORBIDDEN,
      )
    }
    console.log(removedUser)
    return removedUser
  }

  //


  @Roles(Role.User, Role.Admin)
  @Patch('avatar/upload/:id')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: `File avatar uploaded`,
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Uploads user avatar successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden. Cant uploads user avatar' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) body,
    @Param('id') id: string,
  ) {
    if (file) {
      const cloudinaryFile = await this.cloudinaryService
        .uploadImage(`./uploads/${file.filename}`, file)
        .catch((err) => {
          throw new HttpException(
            {
              message: err.message,
            },
            HttpStatus.BAD_REQUEST,
          )
        })
      console.log({ cloudinaryFile })
      const cloudUrl = {
        url: cloudinaryFile.url,
        original_filename: cloudinaryFile.original_filename,
      }
      return this.userService.saveAvatar(cloudUrl, id)
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cant uploads user avatar',
        },
        HttpStatus.FORBIDDEN,
      )
    }
  }
}
