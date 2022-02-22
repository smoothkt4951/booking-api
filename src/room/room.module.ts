import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [MulterModule.register({ dest: '../upload' })],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
