import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    async getAllUsers(){
        return await `get all users ok`;  
    }

    async getUser(id){
        return await `get user by ${id}`;
    }

    async createUser(id, body){
        return await `create user: ${id} ++ ${body}`;
    }

    async updateUser(id, body){
        return `updated by ${id} ++ ${body}`;
    }

    async removeUser(id){
        return `rm by ${id}`;
    }
}
