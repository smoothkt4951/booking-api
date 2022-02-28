import { Gender, Role, UserEntity } from 'src/user/user.entity';

export const UserStub = {
  user: {
    id: '77b07646-e2ff-436c-a06a-21c110ad9d89',
    email: 'test@example.com',
    firstname: 'testerfirstname',
    lastname: 'testerlastname',
    password: '123456',
    role: Role.User,
    gender: Gender.OTHER,
    avatarUrl: '',
    dateOfBirth: '',
    hashPassword: '',
    passwordConfirm: '',
  },
  createUser: {
    firstname: 'harry',
    lastname: 'hoang',
    email: 'tester@gmail.com',
    password: '123456',
  },

  updateUser: {
    firstname: 'harryUpdated',
    lastname: 'hoangUpdated',
    gender: Gender.MALE,
    dayOfBirth: '1999-02-09',
  },

  usersAll: [
    {
      firstname: 'harryX',
      lastname: 'hoang',
      email: 'user@gmail.cvn',
      password: '$2b$08$QfuKZcwI51faFnWtwhspuemUE4oIMgZGwFmi4x1yFV5s2IWUh4H9K',
      id: 'd4c1ca20-cf10-42af-9e71-98f21a7d19a4',
      role: 'user',
      gender: 'other',
      dateOfBirth: null,
      avatarUrl: null,
    },
    {
      firstname: 'harryX',
      lastname: 'hoang',
      email: 'user2@gmail.cvn',
      password: '$2b$08$90nkvmbDwYVzui6z0NGK7ejtatVEiMtPxyNSddxcDkj/UQIBXBNDq',
      id: 'd8679948-57c4-4d3e-a078-0aae6aa3f73a',
      role: 'user',
      gender: 'other',
      dateOfBirth: null,
      avatarUrl: null,
    },
    {
      firstname: 'harryX',
      lastname: 'hoang',
      email: 'user3@gmail.cvn',
      password: '$2b$08$Ep2n4.KdYt8PtsBkwQJ/6u6TuaQMC9pnSljzsoL8KOmNxqeN.Klg6',
      id: '6672385c-cb51-4cde-b44f-9fd03733b13f',
      role: 'user',
      gender: 'other',
      dateOfBirth: null,
      avatarUrl: null,
    },
    {
      firstname: 'Updated Harry',
      lastname: 'Hoang',
      email: 'hyperAdmin@gmail.cvn',
      password: '$2b$08$nzk5pjBBW4C/QCTaXGhMmekw6FfzxjfglumylFx0lNhUPgNPBe2uu',
      id: '566da704-0322-40d5-b880-fd3e2c41442b',
      role: 'user',
      gender: 'male',
      dateOfBirth: '1999-02-09',
      avatarUrl: null,
    },
  ],
} as const;

// export const userStub = {
//   id: '77b07646-e2ff-436c-a06a-21c110ad9d89',
//   email: 'test@example.com',
//   firstname: 'testerfirstname',
//   lastname: 'testerlastname',
//   password: '123456',
//   role: Role.User,
//   gender: Gender.OTHER,
//   avatarUrl: '',
//   dateOfBirth: '',
// };
