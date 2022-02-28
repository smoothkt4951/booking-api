import { UpdateUserInfoDto } from 'src/user/dto/update-userInfo.dto';
// import { userStub } from './stubs/user.stubs';
// import { User } from './../user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../user.entity';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserController } from '../user.controller';
// import { usersAllStub } from './stubs/user.stubs';

import { DeleteResult, UpdateResult } from 'typeorm';

// import { TypeOrmModule } from '@nestjs/typeorm';
// jest.mock('./user.service');
// jest.mock('./../cloudinary/cloudinary.module');
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserStub } from './stubs/user.stubs';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

jest.mock('./mocks/user.repository.mock');
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  const userStub = UserStub.user;
  const createUserStub: CreateUserDto = UserStub.createUser;
  const updateUser: UpdateUserInfoDto = UserStub.updateUser;

  const usersAllStub = UserStub.usersAll;
  const userId = UserStub.user.id;

  // const mockDeleteResult: DeleteResult = {
  //   raw: [],
  //   affected: 1,
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      controllers: [UserController],
      // providers: [UserService],
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: UserService,
          useFactory: () => ({
            createUser: jest.fn(() => [] as object),
          }),
        },
        UserService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('#getUser', () => {
    it('should return list of users', async () => {
      jest.spyOn(userService, 'findAllUsers').mockImplementation(async () => {
        return await usersAllStub;
      });
      expect(await userController.getAllUsers()).toEqual(usersAllStub);
    });
  });
  describe('#findUserBy', () => {
    it('should return user by id', async () => {
      jest
        .spyOn(userService, 'findUserBy')
        .mockImplementation(async (userId) => {
          return await userId;
        });
      expect(await userController.getUser(userId)).toEqual(userId);
    });
  });

  describe('#removeUser', () => {
    it('should remove user by id', async () => {
      jest
        .spyOn(userService, 'removeUser')
        .mockImplementation(async (userId) => {
          return await userId;
        });
      expect(await userController.removeUser(userId)).toEqual(userId);
    });
  });

  // describe('create a new user', () => {
  //   it('should call user service create', () => {
  //     userController.createUser(createUserStub);
  //     expect(userService.createUser).toHaveBeenCalled();
  //   });
  // });

  // describe('update a new user', () => {
  //   it('should call user service create', () => {
  //     userController.updateUser(userId, updateUser);
  //     expect(userService.updateUser).toHaveBeenCalled();
  //   });
  // });
});
