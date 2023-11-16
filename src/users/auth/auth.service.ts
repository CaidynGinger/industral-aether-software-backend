import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes,  scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    const users = await this.userService.findByEmail(createUserDto.email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    createUserDto = {
      ...createUserDto,
      password: result,
    };
    const user = await this.userService.create(createUserDto);
    return user;
  }

  async signin(updateUserDto: UpdateUserDto) {
    const [user] = await this.userService.findByEmail(updateUserDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(updateUserDto.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('Invalid credentials')
    }
    return user
  }
}
