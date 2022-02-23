import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findUserBy(id);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
