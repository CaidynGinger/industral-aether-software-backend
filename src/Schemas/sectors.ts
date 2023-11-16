import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SectorDocument = HydratedDocument<SectorItem>;

@Schema()
export class SectorItem {
  @Prop()
  title: string;
  @Prop()
  locationX: string;
  @Prop()
  locationY: string;
  @Prop()
  locationZ: string;
  @Prop({type: Boolean, default: true})
  status: Boolean
  @Prop()
  currentJobs: [];
  @Prop()
  employees: [];
  @Prop()
  inventory: [];
}

export const SectorSchema = SchemaFactory.createForClass(SectorItem);
