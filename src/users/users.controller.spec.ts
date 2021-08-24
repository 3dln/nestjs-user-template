import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [
      { id: 1, email: 'ashkan@gmail.com', password: 'shabneshin' },
      { id: 2, email: 'maryam@gmail.com', password: 'shabnashin' },
      { id: 3, email: 'ario@gmail.com', password: 'shabnashin' },
    ] as User[];
    fakeUsersService = {
      findAll: (): Promise<User[]> => Promise.resolve(users),
      findOne: (id): Promise<User> => Promise.resolve(users[id - 1]),
    };
    fakeAuthService = {
      async handleSignin(email: string, password: string): Promise<User> {
        const user = users.find(
          (item) => item.email === email && item.password === password
        );
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('can return a list of all the registered users after a get method to /auth', async () => {
    const users: User[] = await controller.findAllUsers();
    expect(users.length > 0);
    expect(typeof users[0] === typeof User);
  });

  it('returns a user by sending a get to /auth/id', async () => {
    const user: User = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.email).toEqual('ashkan@gmail.com');
  });

  it('throws an error if user by given id is not found', async () => {
    const user = await controller.findUser('10');
    expect(user).not.toBeDefined();
  });

  it('returns a user with session based on posted credentials', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'ashkan@gmail.com',
        password: 'shabneshin',
      },
      session
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
