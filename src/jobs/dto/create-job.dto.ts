import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  jobType: string;

  @IsNotEmpty()
  @IsString()
  for: string;

  @IsNotEmpty()
  @IsObject()
  jobDetails: Object;

  @IsOptional()
  issuer: string;

  @IsOptional()
  status: string;

  @IsNotEmpty()
  @IsString()
  sectorId: string;
}
