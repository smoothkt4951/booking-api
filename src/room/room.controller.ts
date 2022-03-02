import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common'
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator'
import { FilesInterceptor, MulterModule } from '@nestjs/platform-express'
import { extname, join } from 'path'
import { CreateRoomDto, SearchRoomDto, UpdateRoomDto } from './dto/room.dto'
import { diskStorage } from 'multer'
import { RoomEntity } from './entity/room.entity'
import { RoomService } from './room.service'

// import { RolesGuard } from 'src/auth/roles.guard';

// import { Role } from 'src/user/user.entity';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { Roles } from 'src/auth/decorators/roles.decorator';
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0]
  const fileExtName = extname(file.originalname)
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('')
  callback(null, `${name}-${randomName}${fileExtName}`)
}
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Get('pagination')
  async getPaginatedRoom(@Query() queryParams: SearchRoomDto): Promise<object> {
    const builder = await this.roomService.getRoomPagination('room_entity')
    if (queryParams.keyword) {
      builder.where('room_entity.codeName LIKE :keyword', {
        keyword: `%${queryParams.keyword}%`,
      })
    }
    const sort: any = queryParams.sort
    if (sort) {
      builder.orderBy('room_entity.price', sort.toUpperCase())
    }
    const page: number = Number(queryParams.page) || 1
    const limit: number = Number(queryParams.limit) || 1
    const total = await builder.getCount()
    builder.offset((page - 1) * limit).limit(limit)

    return {
      data: await builder.getMany(),
      total,
      page,
      last_page: Math.ceil(total / limit),
    }
  }
  @Get('/:roomId')
  getRoomById(
    @Param(
      'roomId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    roomId: string,
  ): Promise<RoomEntity> {
    const room = this.roomService.findOne(roomId)
    if (room) {
      return room
    } else {
      throw new NotFoundException()
    }
  }
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.Admin)
  @Put('/:roomId')
  updateRoomById(
    @Param(
      'roomId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    roomId: string,
    @Body() body: UpdateRoomDto,
  ): Promise<string> {
    return this.roomService.updateRoom(roomId, body)
  }
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.Admin)
  @Delete('/:roomId')
  deleteRoomById(
    @Param(
      'roomId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    roomId: string,
  ): Promise<string> {
    return this.deleteRoomById(roomId)
  }
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.Admin)
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
    @Param(
      'roomId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    roomId: string,
    @UploadedFiles() files,
  ): Promise<string> {
    const response = []
    if (files) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const fileReponse = {
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          path: file.path,
        }
        let url = await this.roomService.addRoomImagesToCloud(fileReponse)
        response.push(url)
      }
      return this.roomService.updateRoomImages(roomId, response)
    }
  }
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.Admin)
  @Post()
  createRoom(@Body() body: CreateRoomDto): Promise<object> {
    return this.roomService.createRoom(body)
  }
  @Get()
  getAllRoom(): Promise<RoomEntity[]> {
    const listRoom = this.roomService.findAll()
    if (listRoom) {
      return listRoom
    } else {
      throw new NotFoundException()
    }
  }
}
