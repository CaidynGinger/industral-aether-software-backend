import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  title: string;
  @IsString()
  locationX: string;
  @IsString()
  locationY: string;
  @IsString()
  locationZ: string;
}
