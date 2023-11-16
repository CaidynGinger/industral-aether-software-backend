import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './entities/job.entity';
import { UsersService } from 'src/users/users.service';
import { changeJobStatusDto } from './dto/ChangeJobStatus.dto';
import { ObjectItem } from 'src/Schemas/objects';
import { ProductionLineItem } from 'src/Schemas/ProductionLine';
import { ProductionLinesService } from 'src/production-lines/production-lines.service';
import { log } from 'console';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(ObjectItem.name) private objectModel: Model<ObjectItem>,
    @InjectModel(ProductionLineItem.name)
    private productionLineModel: Model<ProductionLineItem>,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(ProductionLinesService)
    private readonly productionLinesService: ProductionLinesService,
  ) {}

  create(userId: string, createJobDto: CreateJobDto) {
    // console.log(createJobDto);
    // return { createJobDto, userId };

    const createdJob = new this.jobModel({
      ...createJobDto,
      issuer: userId,
    });

    return createdJob.save();
  }

  async findAll() {
    const jobsList = await this.jobModel.find().exec();

    const detailedJobsList = await Promise.all(
      jobsList.map(async (job) => {
        const issuerDetails = await this.userService.findOne(job.issuer);
        const forDetails = await this.userService.findOne(job.issuer);
        return {
          ...job.toObject(), // Use toObject() to convert Mongoose document to plain JavaScript object
          issuer: issuerDetails,
          for: forDetails,
        };
      }),
    );

    return detailedJobsList;
  }

  findOne(id: string) {
    return this.jobModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: string) {
    return this.jobModel.findByIdAndRemove(id);
  }

  async changeJobStatus(changeJobStatusDto: changeJobStatusDto) {
    // return changeJobStatusDto

    const sectorInventory = await this.getInventory(
      changeJobStatusDto.sectorId,
    );

    const job = await this.jobModel.findById(changeJobStatusDto.JobId);

    if (job.jobType === 'Production') {
      const productionLine = await this.productionLinesService.findOne(
        job.jobDetails.selectedItemId,
      );

      productionLine.map((productionLine) => {
        productionLine.productionLineInputs.forEach((input) => {
          // console.log(sectorInventory);

          // console.log(input);

          // find material
          const newMaterialAmountValue = sectorInventory.find(
            (item) => item._id.toString() === input._id.toString(),
          );

          if (newMaterialAmountValue === undefined) {
            throw new BadRequestException(
              'No material of ' + input.objectTitle + ' found.',
            );
          }
          const amountChange = (newMaterialAmountValue.amount -= input.amount);

          if (amountChange < 0) {
            throw new BadRequestException(
              'Not enough material of ' + input.objectTitle,
            );
          }
        });
      });
    }

    if (job.jobType === 'Export') {
      const newMaterialAmountValue = (sectorInventory.find(
        (item) => item._id.toString() === job.jobDetails.selectedItemId,
      ).amount -= job.jobDetails.objectAmount);

      if (newMaterialAmountValue < 0) {
        throw new BadRequestException('Not enough materials');
      }
    }
    job.status = changeJobStatusDto.status;
    job.save();

    // validate job

    // get inventyory form full jobs

    return sectorInventory;
  }

  async getInventory(sectorId: string) {
    const jobList = await this.jobModel.find({ sectorId: sectorId }).exec();

    // find all complete jobs
    const completedJobs = jobList.filter((job) => job.status === 'completed');

    const completedJobsNoProduction = completedJobs.filter(
      (job) => job.jobType !== 'Production',
    );

    const categoryOrder = ['Imports', 'Stock Update', 'Production', 'Exports'];

    const sortedInventory = completedJobsNoProduction.sort(
      (a, b) =>
        categoryOrder.indexOf(a.jobType) - categoryOrder.indexOf(b.jobType),
    );

    // const sortedInventoryExpandedProductionLines = await Promise.all(
    //   sortedInventory.map(async (job) => {
    //     if (job.jobType === 'Production') {
    //       const productionLine = await this.productionLinesService.findOne(
    //         job.jobDetails.selectedItemId,
    //       );

    //       productionLine.map((productionLine) => {
    //         productionLine.productionLineInputs.forEach((input) => {
    //           console.log(input);
    //           return input;
    //         });
    //         productionLine.productionLineOutputs.forEach((output) => {
    //           console.log(output);
    //           return output;
    //         });
    //       }
    //       );
    //     }
    //     return job;
    //   }),
    // );

    // log(sortedInventoryExpandedProductionLines);

    // production line eddititng

    const completedJobsProductionOnly = completedJobs.filter(
      (job) => job.jobType === 'Production',
    );

    const allInputs = [];
    const allOutputs = [];

    await Promise.all(
      completedJobsProductionOnly.map(async (job) => {
        const productionLine = await this.productionLinesService.findOne(
          job.jobDetails.selectedItemId,
        );
        productionLine.map((productionLine) => {
          productionLine.productionLineInputs.forEach((input) => {
            allInputs.push(input);
          });
          productionLine.productionLineOutputs.forEach((output) => {
            allOutputs.push(output);
          });
        });

        // return productionLine;
      }),
    );
    // log(productionLineDetailed);

    // productionLineDetailed.map((productionLine) => {
    //   log(productionLine[0]);
    // });

    // productionLineDetailed.map((productionLine) => {
    //   productionLine[0].productionLineInputs.forEach((input) => {
    //     allInputs.push(input);
    //   });
    // }
    // );

    // console.log(sortedInventory);

    const inventory = sortedInventory.reduce((acc, job) => {
      const existingMaterial = acc.find(
        (item) => item.material === job.jobDetails.selectedItemId,
      );
      if (existingMaterial) {
        if (job.jobType === 'Export') {
          existingMaterial.quantity -= job.jobDetails.objectAmount;
        } else {
          existingMaterial.quantity += job.jobDetails.objectAmount;
        }
        // If material already exists in the inventory, update the quantity
      } else {
        // If material doesn't exist, add it to the inventory
        if (job.jobType === 'Export') {
          acc.push({
            material: job.jobDetails.selectedItemId,
            quantity: -1 * job.jobDetails.objectAmount,
            type: job.jobType,
          });
        } else {
          acc.push({
            material: job.jobDetails.selectedItemId,
            quantity: job.jobDetails.objectAmount,
            type: job.jobType,
          });
        }
        
      }

      return acc;
    }, []);

    const fullInventory = await Promise.all(
      inventory.map(async (item) => {
        const materialDetails = await this.objectModel
          .findOne({ _id: item.material })
          .exec();
        return {
          ...materialDetails.toObject(),
          amount: item.quantity,
        };
      }),
    ); 
    
    console.log(fullInventory);
    

    fullInventory.push(...allInputs);

    const fullInventoryReduced = [];

    fullInventory.forEach((item) => {
      const existingItem = fullInventoryReduced.find(
        (item2) => item2._id.toString() === item._id.toString(),
      );
      if (existingItem) {
        existingItem.amount -= +item.amount;
      } else {
        fullInventoryReduced.push(item);
      }
    });

    fullInventoryReduced.push(...allOutputs);

    const fullInventoryReducedFull = [];

    

    fullInventoryReduced.forEach((item) => {
      const existingItem = fullInventoryReducedFull.find(
        (item2) => item2._id.toString() === item._id.toString(),
      );
      if (existingItem) {
        // console.log(existingItem);
        
        existingItem.amount += +item.amount;
      } else {
        fullInventoryReducedFull.push({
          ...item,
          amount: +item.amount,
        });
      }
    });
    // console.log(fullInventoryReducedFull);

    return fullInventoryReducedFull;
  }

  async findAllSectorJobs(id: string) {
    const jobList = await this.jobModel.find({ sectorId: id }).exec();
    const detailedJobsList = await Promise.all(
      jobList.map(async (job) => {
        const issuerDetails = await this.userService.findOne(job.issuer);
        const forDetails = await this.userService.findOne(job.issuer);
        return {
          ...job.toObject(), // Use toObject() to convert Mongoose document to plain JavaScript object
          issuer: issuerDetails,
          for: forDetails,
        };
      }),
    );

    return detailedJobsList;
  }
}
