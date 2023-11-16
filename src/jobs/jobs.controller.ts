import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { changeJobStatusDto } from './dto/ChangeJobStatus.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(
    @Headers('userId') userId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    return this.jobsService.create(userId, createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch('changeJobStatus')
  changeJobStatus(@Body() changeJobStatusDto: changeJobStatusDto) {    
    return this.jobsService.changeJobStatus(changeJobStatusDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
  //   return this.jobsService.update(id, updateJobDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @Get('sector/:id')
  findAllSectorJobs(@Param('id') id: string) {
    return this.jobsService.findAllSectorJobs(id);
  }

  @Get('sector/inventory/:id')
  getInventory(@Param('id') id: string) {
    return this.jobsService.getInventory(id);
  }
}
