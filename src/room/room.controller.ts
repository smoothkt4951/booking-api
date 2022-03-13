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
import { RoomEntity } from './entities/room.entity'
import { RoomService } from './room.service'
import { Public } from 'src/auth/decorators/public.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/user/entities/user.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

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
  @ApiBearerAuth('access-token')
  @Get('pagination')
  async getPaginatedRoom(@Query() queryParams: SearchRoomDto): Promise<object> {
    const builder = await this.roomService.getRoomPagination('room_entity')
    if (queryParams.keyword && queryParams.keyword != undefined) {
      builder.where('room_entity.codeName LIKE :keyword', {
        keyword: `%${queryParams.keyword}%`,
      })
    }
    // console.log(
    //   'page & limit',
    //   queryParams.page,
    //   queryParams.limit,
    //   queryParams.keyword,
    // )
    builder.orderBy('room_entity.created_at', 'DESC')

    const page: number = Number(queryParams.page) || 1
    const limit: number = Number(queryParams.limit) || 5
    const total = await builder.getCount()
    builder.offset((page - 1) * limit).limit(limit)
    return {
      data: await builder.getMany(),
      total,
      page,
      last_page: Math.ceil(total / limit),
    }
  }
  @ApiBearerAuth('access-token')
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
  @ApiBearerAuth('access-token')
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
  ): Promise<object> {
    return this.roomService.updateRoom(roomId, body)
  }
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.Admin)
  @ApiBearerAuth('access-token')
  @Delete('/:roomId')
  deleteRoomById(
    @Param(
      'roomId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    roomId: string,
  ): Promise<object> {
    return this.roomService.deleteRoom(roomId)
  }
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.Admin)
  @ApiBearerAuth('access-token')
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
    console.log('haha')
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
  @ApiBearerAuth('access-token')
  @Post()
  createRoom(@Body() body: CreateRoomDto): Promise<object> {
    return this.roomService.createRoom(body)
  }
  @Get()
  @Public()
  getAllRoom(): Promise<RoomEntity[]> {
    const listRoom = this.roomService.findAll()
    if (listRoom) {
      return listRoom
    } else {
      throw new NotFoundException()
    }
  }
}
