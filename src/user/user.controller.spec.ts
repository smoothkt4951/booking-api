import { UserModule } from './user.module';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
// import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { TypeOrmModule } from '@nestjs/typeorm';
// jest.mock('./user.service');
// jest.mock('./../cloudinary/cloudinary.module');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  let results;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      controllers: [UserController],
      // providers: [UserService],
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {
            get: jest.fn(() => jest.fn()), // really it can be anything, but the closer to your actual logic the better
          },
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

  //   beforeEach(async () => {
  //     const moduleRef = await Test.createTestingModule({
  //         imports: [],
  //         controllers: [UsersController],
  //         providers: [UsersService]
  //     }).compile();

  //     usersController = moduleRef.get<UsersController>(UsersController);
  //     usersService = moduleRef.get<UsersService>(UsersService);
  //     jest.clearAllMocks();
  // });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = ['test'];
      jest.spyOn(userService, 'findAllUsers').mockImplementation(async () => {
        return await result;
      });

      expect(await userController.getAllUsers()).toBe(result);
    });

    // it('FindAll', async () => {
    //   const users = new Array<UserEntity>();
    //   // const user = new UserEntity(
    //   //   { firstname: 'tester' },
    //   //   { lastname: 'tester' },
    //   //   { email: 'tester@gmail.com' },
    //   //   { password: '123456' },
    //   // );
    //   const user = new UserEntity(
    //     'tester',
    //     'tester',
    //     'tester@gmail.com',
    //     '123456',
    //   );
    //   user.email = 'tester@gmail.com';
    //   users.push(user);
    //   // const response = [{ id: 1 }];
    //   jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);
    //   results = await userService.findAllUsers();
    //   console.log(results);
    //   expect(results).toBeDefined();
    // });

    // describe('when getAllUsers is called', () => {
    //   let users: UserEntity;

    //   beforeEach(async () => {
    //     users = await userController.getAllUsers();
    //   });

    //   test('then it should call usersService.getUsers', () => {
    //     expect(userService.findAllUsers).toHaveBeenCalled();
    //   });

    //   test('then it should return a users array', () => {
    //     expect(users).toBeDefined();
    //   });
    // });
  });
});
