import { Module } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { SectorsController } from './sectors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SectorItem, SectorSchema } from 'src/Schemas/sectors';
import { Job, JobSchema } from 'src/jobs/entities/job.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SectorItem.name,
        schema: SectorSchema,
      },
      {
        name: Job.name,
        schema: JobSchema,
      }
    ]),
  ],
  controllers: [SectorsController],
  providers: [SectorsService]
})
export class SectorsModule {}
