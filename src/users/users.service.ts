import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findByEmail(email: string) {
    const user = this.userModel.find({ email: email });
    return user;
  }

  signin(@Body() updateUserDto: UpdateUserDto) {
    return 'This action adds a new user';
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
