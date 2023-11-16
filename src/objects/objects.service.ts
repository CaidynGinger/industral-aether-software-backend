import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectItem } from 'src/Schemas/objects';
import { Model } from 'mongoose';

@Injectable()
export class ObjectsService {

  constructor(
    @InjectModel(ObjectItem.name) private objectModel: Model<ObjectItem>,
  ) {}

  create(createObjectDto: CreateObjectDto) {
    const createdObject = new this.objectModel(createObjectDto);
    return createdObject.save()
  }

  async findAll(): Promise<ObjectItem[]> {
    return this.objectModel.find().exec();
  }

  async findOne(id: string) {
    return await this.objectModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateObjectDto: UpdateObjectDto): Promise<ObjectItem> {
    const object = await this.objectModel.findByIdAndUpdate(id, updateObjectDto, {new: true}).exec();
    if (!object) {
      throw new NotFoundException(`Object #${id} not found`);
    }
    Object.assign(object, updateObjectDto);
    return object
  }

  async remove(id: string) {
    return await this.objectModel.findByIdAndRemove(id);
  }
}
