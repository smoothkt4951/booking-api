import { Test, TestingModule } from '@nestjs/testing';
import { RoomResponseDto } from './dto/room.dto';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

describe('RoomController', () => {
  let controller: RoomController;
  let service: RoomService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        { provide: RoomService, useValue: { get: jest.fn(() => jest.fn()) } },
        { provide: RoomService, useValue: { findOne: jest.fn((x) => x) } },
        // { provide: RoomService, useValue: { findAll: jest.fn((x) => x) } },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get<RoomService>(RoomService);
  });
  let responseMock = jest.fn((x: RoomResponseDto) => x);
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // describe('getRoomById', () => {
  //   it('should return a room object', async () => {
  //     //   controller.getRoomById('ff7824da-d2ed-42ac-a4ca-e42250f89702');
  //     let result = await controller.getRoomById(
  //       'ff7824da-d2ed-42ac-a4ca-e42250f89702',
  //     );
  //     console.log('aaa', result);
  //     expect(result).toHaveBeenCalledWith(responseMock);
  //   });
  // });
  //   describe('getAllRoom', () => {
  //     it('should call findAllRoom', async () => {
  //       controller.getAllRoom();
  //       expect(service.findAll).toHaveBeenCalled();
  //     });
  //   });
});
