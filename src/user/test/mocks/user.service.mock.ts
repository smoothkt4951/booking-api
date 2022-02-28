import { UserStub } from '../stubs/user.stubs';

export const mockUserService = jest.fn().mockReturnValue({
  getUserById: jest.fn().mockResolvedValue(UserStub.user),
  getUsers: jest.fn().mockResolvedValue([UserStub.user]),
  createUser: jest.fn().mockResolvedValue(UserStub.user),
  // updateUser: jest.fn().mockResolvedValue((UserStub.user),
});
