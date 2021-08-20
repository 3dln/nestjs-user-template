import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async handleSignup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // Hash the user password
    // Generate a salt
    const salt = randomBytes(8).toString('hex'); //16 character long string
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hash result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.usersService.create(email, result);
    console.log(user);
    // Return the user
    return user;
  }

  handleSignin() {}
}
