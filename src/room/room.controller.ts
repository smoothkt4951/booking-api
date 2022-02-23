import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  StreamableFile,
  UploadedFiles,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { FilesInterceptor, MulterModule } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { diskStorage } from 'multer';
import { RoomEntity } from './entity/room.entity';
import { RoomService } from './room.service';
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
@Controller()
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Get()
  getAllRoom(): Promise<RoomEntity[]> {
    return this.roomService.findAll();
  }
  @Get('/:roomId')
  getRoomById(@Param('roomId') roomId: string): Promise<RoomEntity> {
    return this.roomService.findOne(roomId);
  }
  @Get()
  getListAvailableRoom(): Promise<RoomEntity[]> {
    return this.roomService.findAvailableRooms();
  }
  @Post()
  createRoom(@Body() body: CreateRoomDto): Promise<object> {
    return this.roomService.createRoom(body);
  }
  @Put('/:roomId')
  updateRoomById(
    @Param('roomId') roomId: string,
    @Body() body: UpdateRoomDto,
  ): Promise<any> {
    return this.roomService.updateRoom(roomId, body);
  }
  @Delete('/:roomId')
  deleteRoomById(@Param('roomId') roomId: string): Promise<object> {
    return this.deleteRoomById(roomId);
  }
  @Post('/images/:roomId')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadRoomImages(
    @Param('roomId') roomId: string,
    @UploadedFiles() files,
  ): Promise<string> {
    const response = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
        size: file.size,
        path: file.path,
      };
      let url = await this.roomService.addRoomImagesToCloud(fileReponse);
      response.push(url);
    }
    return this.roomService.updateRoomImages(roomId, response);
  }
}
