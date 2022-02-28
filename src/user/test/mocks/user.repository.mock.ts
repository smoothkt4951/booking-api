// import { userStub } from './../test/stubs/user.stub';

export const UserRepositoryMock = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(true),
  find: jest.fn().mockResolvedValue(true),
  create: jest.fn().mockResolvedValue(true),
  findOneAndUpdate: jest.fn().mockResolvedValue(true),
});
