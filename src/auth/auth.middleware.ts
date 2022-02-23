import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('authMiddle', req.headers);

    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = this.jwtService.verify(token);
      console.log('decode', decode);
      const { userId } = decode;

      const user = await this.userService.findUserBy({ userId });
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
