import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserEntity } from 'src/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user.service';

describe('UserService', () => {
  let userService: UserService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: { findOne } },
      ],
    }).compile();

    // service = module.get<UserService>(UserService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
