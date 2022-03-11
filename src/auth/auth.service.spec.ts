import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'

const mockedJwtService = {
  sign: () => '',
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
})

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let userRepository: MockRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        CloudinaryService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userService = module.get(UserService)
    userRepository = module.get<MockRepository>(getRepositoryToken(UserEntity))
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should attempt to create user when register', async () => {
    const mockedUser: RegisterDto = {
      firstname: 'User3',
      lastname: 'Doe',
      email: 'user1@email.com',
      password: '123456',
      passwordConfirm: '123456',
    }

    // userRepository.create.getMockImplementation()
    const createUserSpy = jest.spyOn(userService, 'createUser')
    await authService.register(mockedUser)
    expect(createUserSpy).toBeCalledTimes(1)
  })
})
