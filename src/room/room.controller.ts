import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Controller('rooms')
export class RoomController {
  @Get()
  getAllRoom(): string {
    return 'All rooms';
  }
  @Get('/:roomId')
  getRoomById(@Param('roomId') roomId: string): string {
    return 'Room id';
  }
  @Get()
  getListAvailableRoom(): string {
    return 'Room id';
  }
  @Post()
  createRoom(@Body() body: CreateRoomDto): string {
    return 'Body room';
  }
  @Put('/:roomId')
  updateRoomById(
    @Param('roomId') roomId: string,
    @Body() body: UpdateRoomDto,
  ): string {
    return 'Room id, body room';
  }
  @Delete('/:roomId')
  deleteRoomById(@Param('roomId') roomId: string): string {
    return 'Room id';
  }
}
