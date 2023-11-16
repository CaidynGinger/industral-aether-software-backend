import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ObjectDocument = HydratedDocument<ProductionLineItem>;

class condensedObjectItem {
    _id: string;
    amount: number;
}

@Schema()
export class ProductionLineItem {
  @Prop()
  productionLineTitle: string;
  @Prop()
  productionLineInputs: condensedObjectItem[];
  @Prop()
  productionLineOutputs: condensedObjectItem[];
}

export const ProductionLineSchema = SchemaFactory.createForClass(ProductionLineItem);
