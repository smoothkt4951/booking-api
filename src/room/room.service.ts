import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRoomDto,
  FileDto,
  RoomResponseDto,
  UpdateRoomDto,
} from './dto/room.dto';
import { RoomEntity } from './entity/room.entity';
import { unlinkSync } from 'fs';
import { v2 } from 'cloudinary';
const cloud = v2;
cloud.config({
  cloud_name: 'hkt-dev',
  api_key: '496229631921393',
  api_secret: 'kGNgnP5EKj2FHqyKnJO_9EnEjzI',
});
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomsRepository: Repository<RoomEntity>,
  ) {}

  async findAll(): Promise<RoomEntity[]> {
    return await this.roomsRepository.find();
  }
  async findOne(roomId: string): Promise<RoomEntity> {
    return await this.roomsRepository.findOne({ id: roomId });
  }
  async findAvailableRooms(): Promise<RoomEntity[]> {
    return await this.roomsRepository.find({ where: { isVacant: true } });
  }
  async findOccupiedRooms(): Promise<RoomEntity[]> {
    return await this.roomsRepository.find({ where: { isVacant: false } });
  }
  async createRoom(payload: CreateRoomDto): Promise<object> {
    const newRoom = {
      ...payload,
    };
    await this.roomsRepository.insert(newRoom);
    return JSON.parse(JSON.stringify(newRoom));
  }
  async updateRoom(roomId: string, payload: UpdateRoomDto): Promise<object> {
    let updatedRoom = this.findOne(roomId);
    if (updatedRoom === undefined) {
      throw new NotFoundException();
    }
    await this.roomsRepository.update(roomId, payload);
    return JSON.parse(JSON.stringify({ message: 'The room has been updated' }));
  }
  async deleteRoom(roomId: string): Promise<object> {
    await this.roomsRepository.delete(roomId);
    return JSON.parse(JSON.stringify({ message: 'The room has been updated' }));
  }
  async addRoomImagesToCloud(fileRes: FileDto): Promise<string> {
    const fileName = fileRes.filename.split('.')[0];
    const folderCloud = `Test/${fileName}`;
    let URL: string;
    URL = await cloud.uploader
      .upload(fileRes.path, { public_id: folderCloud })
      .then(async (result: any) => {
        unlinkSync(fileRes.path);
        return result.url;
      })
      .catch((err: any) => {
        console.log(err);
      });
    return URL;
  }
  async updateRoomImages(roomId: string, imgArr: string[]): Promise<string> {
    let room = this.roomsRepository.findOne(roomId);
    if (room === undefined) {
      throw new NotFoundException();
    }
    let joinArr: string[];
    joinArr = [...(await room).images, ...imgArr];
    await this.roomsRepository.update({ id: roomId }, { images: [...joinArr] });
    return JSON.parse(
      JSON.stringify({ message: 'The images has been uploaded' }),
    );
  }
  //   async (roomId: string): Promise<RoomEntity> {
  //     return await this.roomsRepository.findOne({ id: roomId });
  //   }
}
