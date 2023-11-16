import { Module } from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service';
import { ProductionLinesController } from './production-lines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductionLineItem, ProductionLineSchema } from 'src/Schemas/ProductionLine';
import { ObjectsService } from 'src/objects/objects.service';
import { ObjectsModule } from 'src/objects/objects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductionLineItem.name,
        schema: ProductionLineSchema,
      },
    ]),
    ObjectsModule,
  ],
  controllers: [ProductionLinesController],
  providers: [ProductionLinesService],
  exports: [ProductionLinesService],
})
export class ProductionLinesModule {}
