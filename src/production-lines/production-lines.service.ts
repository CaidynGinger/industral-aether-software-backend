import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductionLineItem } from 'src/Schemas/ProductionLine';
import { Model } from 'mongoose';
import { ObjectsService } from 'src/objects/objects.service';
import { log } from 'console';

@Injectable()
export class ProductionLinesService {
  constructor(
    @InjectModel(ProductionLineItem.name)
    private productionLineModel: Model<ProductionLineItem>,
    private readonly objectsService: ObjectsService,
  ) {}

  async create(createProductionLineDto: CreateProductionLineDto) {
    const ProductionLineCondensed = {
      productionLineTitle: createProductionLineDto.productionLineTitle,
      productionLineInputs: createProductionLineDto.productionLineInputs.map(
        (input) => {
          return {
            _id: input._id,
            amount: input.amount,
          };
        },
      ),
      productionLineOutputs: createProductionLineDto.productionLineOutputs.map(
        (output) => {
          return {
            _id: output._id,
            amount: output.amount,
          };
        },
      ),
    };
    const createdProductionLine = new this.productionLineModel(
      ProductionLineCondensed,
    );
    return createdProductionLine.save();
  }

  async findAll() {
    const productionLineList = await this.productionLineModel.find().exec();
    const productionLineListFull = await Promise.all(
      productionLineList.map(async (productionLine) => {
        return {
          _id: productionLine._id,
          productionLineTitle: productionLine.productionLineTitle,
          productionLineInputs: await Promise.all(
            productionLine.productionLineInputs.map(async (input) => {
              const object = await this.objectsService.findOne(input._id)
              return {
                _id: object._id,
                objectTitle: object.objectTitle,
                amount: input.amount,
                unit: object.unit,
              }
            }),
          ),
          productionLineOutputs: await Promise.all(
            productionLine.productionLineOutputs.map(async (output) => {
              const object = await this.objectsService.findOne(output._id)
              return {
                _id: object._id,
                objectTitle: object.objectTitle,
                amount: output.amount,
                unit: object.unit,

              }
            }),
          ),
        };
      }),
    );
        
    return productionLineListFull
  }

  async findOne(id: string) {
    const productionLine = await this.productionLineModel.find({ _id: id }).exec();
    const fullProductionLine = await Promise.all(
      productionLine.map(async (productionLine) => {
        return {
          _id: productionLine._id,
          productionLineTitle: productionLine.productionLineTitle,
          productionLineInputs: await Promise.all(
            productionLine.productionLineInputs.map(async (input) => {
              const object = await this.objectsService.findOne(input._id)
              return {
                _id: object._id,
                objectTitle: object.objectTitle,
                amount: input.amount,
                unit: object.unit,
              }
            }),
          ),
          productionLineOutputs: await Promise.all(
            productionLine.productionLineOutputs.map(async (output) => {
              const object = await this.objectsService.findOne(output._id)
              return {
                _id: object._id,
                objectTitle: object.objectTitle,
                amount: output.amount,
                unit: object.unit,

              }
            }),
          ),
        };
      }
    ));
        
    return fullProductionLine
  }

  async update(id: string, updateProductionLineDto: UpdateProductionLineDto) {
    const ProductionLineCondensed = {
      productionLineTitle: updateProductionLineDto.productionLineTitle,
      productionLineInputs: updateProductionLineDto.productionLineInputs.map(
        (input) => {
          return {
            _id: input._id,
            amount: input.amount,
          };
        },
      ),
      productionLineOutputs: updateProductionLineDto.productionLineOutputs.map(
        (output) => {
          return {
            _id: output._id,
            amount: output.amount,
          };
        },
      ),
    };
    const ProductionLine = await this.productionLineModel.findByIdAndUpdate(
      id,
      ProductionLineCondensed,
      { new: true },
    ).exec();

    if (!ProductionLine) {
      throw new NotFoundException(`ProductionLine #${id} not found`);
    }
    return ProductionLine;
  }

  async remove(id: string) {
    return await this.productionLineModel.findByIdAndRemove(id);
  }
}
