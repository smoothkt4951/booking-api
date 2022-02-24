import {
  HttpException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';
@Injectable()
export class RoomsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(RoomEntity)
    private roomsRepository: Repository<RoomEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const roomId = req.params.roomId;
    const checkRoomExist = await this.roomsRepository.findOne({ id: roomId });
    if (checkRoomExist === undefined) {
      throw new HttpException('Room has not been found', 400);
    }

    next();
  }
}
