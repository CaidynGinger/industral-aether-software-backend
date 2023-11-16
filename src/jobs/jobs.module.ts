import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './entities/job.entity';
import { UsersModule } from 'src/users/users.module';
import { ObjectItem, ObjectSchema } from 'src/Schemas/objects';
import { ProductionLineItem, ProductionLineSchema } from 'src/Schemas/ProductionLine';
import { ProductionLinesModule } from 'src/production-lines/production-lines.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Job.name,
        schema: JobSchema,
      },
      {
        name: ObjectItem.name,
        schema: ObjectSchema,
      },
      {
        name: ProductionLineItem.name,
        schema: ProductionLineSchema,
      },
    ]),
    UsersModule,
    ProductionLinesModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
