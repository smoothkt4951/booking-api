import {
  HttpException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import {
  CreateRoomDto,
  FileDto,
  RoomResponseDto,
  UpdateRoomDto,
} from './dto/room.dto'
import { RoomEntity } from './entity/room.entity'
import { unlinkSync } from 'fs'
import { v2 } from 'cloudinary'
const cloud = v2
cloud.config({
  cloud_name: 'hkt-dev',
  api_key: '496229631921393',
  api_secret: 'kGNgnP5EKj2FHqyKnJO_9EnEjzI',
})
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity) private roomsRepository: Repository<RoomEntity>,
  ) {}

  async findAll(): Promise<RoomEntity[]> {
    try {
      return await this.roomsRepository.find({ order: { created_at: 'DESC' } })
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async findOne(roomId: string): Promise<RoomEntity> {
    try {
      return await this.roomsRepository.findOne({ id: roomId })
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async findAvailableRooms(): Promise<RoomEntity[]> {
    try {
      const findAvailableRooms = await this.roomsRepository.find({
        where: { isVacant: true },
      })
      return findAvailableRooms
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async findOccupiedRooms(): Promise<RoomEntity[]> {
    try {
      return await this.roomsRepository.find({
        where: { isVacant: false },
      })
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async createRoom(payload: CreateRoomDto): Promise<object> {
    try {
      const newRoom = {
        ...payload,
      }
      await this.roomsRepository.insert(newRoom)
      return JSON.parse(JSON.stringify(newRoom))
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async updateRoom(
    roomId: string,
    payload: UpdateRoomDto,
  ): Promise<UpdateResult> {
    let updatedRoom = this.findOne(roomId)
    if (updatedRoom === undefined) {
      throw new NotFoundException()
    }
    try {
      return await this.roomsRepository.update(roomId, payload)
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async deleteRoom(roomId: string): Promise<DeleteResult> {
    try {
      return await this.roomsRepository.delete(roomId)
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async addRoomImagesToCloud(fileRes: FileDto): Promise<string> {
    const fileName = fileRes.filename.split('.')[0]
    const folderCloud = `Test/${fileName}`
    let URL: string
    URL = await cloud.uploader
      .upload(fileRes.path, { public_id: folderCloud })
      .then(async (result: any) => {
        unlinkSync(fileRes.path)
        return result.url
      })
      .catch((err: any) => {
        console.log(err)
      })
    return URL
  }
  async updateRoomImages(roomId: string, imgArr: string[]): Promise<string> {
    let room = await this.roomsRepository.findOne(roomId)
    if (room === undefined) {
      throw new NotFoundException()
    }
    try {
      let joinArr: string[]
      if (room?.images === null) {
        await this.roomsRepository.update(
          { id: roomId },
          { images: [...imgArr] },
        )
        return 'The images has been uploaded'
      } else {
        joinArr = [...(await room)?.images, ...imgArr]
        await this.roomsRepository.update(
          { id: roomId },
          { images: [...joinArr] },
        )
        return 'The images has been uploaded'
      }
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
  async getRoomPagination(alias: string) {
    try {
      return await this.roomsRepository.createQueryBuilder(alias)
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }
}
