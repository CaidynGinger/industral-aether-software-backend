import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ObjectDocument = HydratedDocument<ObjectItem>;

@Schema()
export class ObjectItem {
  @Prop()
  objectTitle: string;
  @Prop()
  unit: string;
  @Prop({type: Number, default: 0})
  amount: number;
}

export const ObjectSchema = SchemaFactory.createForClass(ObjectItem);
