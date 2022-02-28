import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../user/user.entity'
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
  async getPaginatedRoom(@Query() queryParams: SearchRoomDto) {
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
  getRoomById(@Param('roomId') roomId: string): Promise<RoomEntity> {
    return this.roomService.findOne(roomId)
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Put('/:roomId')
  updateRoomById(
    @Param('roomId') roomId: string,
    @Body() body: UpdateRoomDto,
  ): Promise<any> {
    return this.roomService.updateRoom(roomId, body)
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Delete('/:roomId')
  deleteRoomById(@Param('roomId') roomId: string): Promise<object> {
    return this.deleteRoomById(roomId)
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
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
    const response = []
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Post()
  createRoom(@Body() body: CreateRoomDto): Promise<object> {
    return this.roomService.createRoom(body)
  }
  @Get()
  getAllRoom(): Promise<RoomEntity[]> {
    return this.roomService.findAll()
  }
}
