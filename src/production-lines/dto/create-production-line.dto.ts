import { IsArray, IsNumber, IsString } from 'class-validator';

class condensedObjectItem {
  @IsString()
  _id: string;
  @IsNumber()
  amount: number;
}

export class CreateProductionLineDto {
  @IsString()
  _id: string;
  @IsString()
  productionLineTitle: string;
  @IsArray()
  productionLineInputs: condensedObjectItem[];
  @IsArray()
  productionLineOutputs: condensedObjectItem[];
}
