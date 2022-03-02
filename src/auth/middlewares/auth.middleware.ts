import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    // private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('authMiddle', req.headers);

    if (!req.headers.authorization) {
      throw new HttpException('Error', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode: any = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decode', decode);
      const { userId } = decode;

      const user = await this.userService.findUserBy({ id: userId });
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).send({
        msg: 'Cannot decode token! Something went wrong',
      });
    }
  }
}
