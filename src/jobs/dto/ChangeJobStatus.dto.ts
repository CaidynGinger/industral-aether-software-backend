import {
    IsString,
    IsNotEmpty,
  } from 'class-validator';
  
  export class changeJobStatusDto {
    @IsNotEmpty()
    @IsString()
    JobId: string;
  
    @IsNotEmpty()
    @IsString()
    sectorId: string;

    @IsNotEmpty()
    @IsString()
    status: string;
  }
  