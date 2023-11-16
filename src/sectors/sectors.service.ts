import { Injectable } from '@nestjs/common';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SectorItem } from 'src/Schemas/sectors';
import { Model } from 'mongoose';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class SectorsService {

  constructor(
    @InjectModel(SectorItem.name) private sectorModel: Model<SectorItem>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}

  async create(createSectorDto: CreateSectorDto) {
    const createdSector = new this.sectorModel(createSectorDto);
    return createdSector.save()
  }

  async findAll() {
    // return `This action returns all sectors`;
    const sectors = await this.sectorModel.find().exec();

    const sectorsWithJobs = Promise.all(
      sectors.map(async (sector) => {
        const jobs = await this.jobModel.find({ sectorId: sector._id }).exec();
        return {
          ...sector.toObject(),
          jobs,
        };
      })
    );
      return sectorsWithJobs;
  }

  findOne(id: string) {
    // log(id)
    return this.sectorModel.findOne({ _id: id }).exec();
  }

  update(id: number, updateSectorDto: UpdateSectorDto) {
    return `This action updates a #${id} sector`;
  }


  remove(id: string) {
    return this.sectorModel.findByIdAndRemove(id);
  }
}
