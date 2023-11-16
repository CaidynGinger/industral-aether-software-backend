import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectItem, ObjectSchema } from 'src/Schemas/objects';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ObjectItem.name,
        schema: ObjectSchema,
      },
    ]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
