import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create a fake copy of the users service
    fakeUsersService = {
      findByEmail: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.handleSignup('test@email.com', 'password');
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.findByEmail = () => {
      return Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    };
    let err = null;
    try {
      await service.handleSignup('test@gmail.com', 'password');
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it('throws error if signin is called with an unused email', async () => {
    let error: null;
    try {
      await service.handleSignin('test@email.com', 'password');
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
  });

  it('throws error if an invalid password is being provided', async () => {
    fakeUsersService.findByEmail = () =>
      Promise.resolve([
        { email: 'test@email.com', password: 'password' } as User,
      ]);
    let err = null;
    try {
      await service.handleSignin('test@email.com', '12345');
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it('returns a user if correct password is provided', async () => {
    await service.handleSignup('test@email.com', 'password');
    const user = await service.handleSignin('test@email.com', 'password');
    expect(user).toBeDefined();
  });
});
