import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { BookingService } from './booking.service'
import { CreateBookingDtoRequest } from '../booking/dto/create-booking.dto'
import { BookingEntity } from '../booking/entities/booking.entity'
import { v4 as uuidv4 } from 'uuid'
import { RoomModule } from '../room/room.module'

import { UserModule } from '../user/user.module'
import { Connection, Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RoomEntity } from '../room/entity/room.entity'
import { UserEntity } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { RoomService } from '../room/room.service'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import exp from 'constants'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
})

describe('Booking Service ', () => {
  let service: BookingService
  let userRepository: MockRepository
  let roomsRepository: MockRepository
  let bookingRepository: MockRepository
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        BookingService,
        { provide: Connection, useValue: {} },
        UserService,
        RoomService,
        CloudinaryService, //naiive way btw
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: createMockRepository(),
        },
      ],
    })
      .compile()
      // .catch((err) => {
      //   console.error(err)
      //   throw err
      // })
    service = moduleRef.get<BookingService>(BookingService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('creating a room', () => {
    it('should return a room instance', async () => {
      const m_out_date = new Date('2011-10-08T14:48:00.000')
      const m_in_date = new Date('2011-10-07T14:48:00.000')
      let dtoObject: CreateBookingDtoRequest = {
        user_id: '420d7d87-57a2-4919-b5a5-1994dc461de5',
        room_id: '2fd4f2ac-b312-418b-beb0-ebaa451d4807',
        check_in_date: m_in_date,
        check_out_date: m_out_date,
      }
      jest.spyOn(service, 'createWithTimesheet') //isssueeee

      return service
        .createWithTimesheet(dtoObject)
        .then((resObj) => expect(resObj).toBeInstanceOf(BookingEntity))
    })
  })
  describe('checking condition for reserving a room given a timesheet', () => {
    it('should return a true value', () => {
      const timesheet = [
        new Date('05 October 2011 14:48 UTC'),
        new Date('06 October 2011 14:48 UTC'),
        new Date('09 October 2011 14:48 UTC'),
        new Date('10 October 2011 14:48 UTC'),
        new Date('12 October 2011 14:48 UTC'),
        new Date('13 October 2011 14:48 UTC'),
      ]
      const test_insert = [
        new Date('14 October 2011 14:48 UTC'),
        new Date('15 October 2011 14:48 UTC'),
      ]
      return service
        .checkTimesheetInsertion(timesheet, test_insert[0], test_insert[1])
        .then((res) => expect(res).toBe(true))
    })
    it('should return a false value', () => {
      const timesheet = [
        new Date('05 October 2011 14:48 UTC'),
        new Date('06 October 2011 14:48 UTC'),
        new Date('09 October 2011 14:48 UTC'),
        new Date('10 October 2011 14:48 UTC'),
        new Date('12 October 2011 14:48 UTC'),
        new Date('13 October 2011 14:48 UTC'),
      ]
      const test_insert = [
        new Date('1 October 2011 14:48 UTC'),
        new Date('13 October 2011 14:48 UTC'),
      ]
      return service
        .checkTimesheetInsertion(timesheet, test_insert[0], test_insert[1])
        .then((res) => expect(res).toBe(false))
    })
  })
  // describe('finding all bookings in database',()=>{
  //   it('should return array of all objects')
  // }

  // )
})
