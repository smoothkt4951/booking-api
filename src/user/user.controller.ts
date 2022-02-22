import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUser(@Param('id') id :string){
        return this.userService.getUser(id);
    }

    @Post(':id')
    async createUser(@Param('id') id: string, @Body() body: any){
        return this.userService.createUser(id, body);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() body: any){
        return this.userService.updateUser(id, body);
    }

    @Delete(':id')
    async removeUser(@Param('id') id: string){
        return this.userService.removeUser(id);
    }
}
