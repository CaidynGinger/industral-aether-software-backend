import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema()
export class Job {
  @Prop()
  jobTitle: string;

  @Prop()
  jobType: string;

  @Prop()
  issuer: string;

  @Prop()
  for: string;

  @Prop({
    default: 'in progress',
  })
  // completed, in progress, waiting, failed
  status: string;

  @Prop({
    type: Object,
  })
  jobDetails: {
    objectTitle: string,
    objectAmount: number,
    selectedItemId: string,
  };

  @Prop()
  sectorId: string;

}

export const JobSchema = SchemaFactory.createForClass(Job);
