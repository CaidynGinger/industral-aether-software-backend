import { IsString } from "class-validator";

export class CreateObjectDto {
    @IsString()
    objectTitle: string;
    @IsString()
    unit: string;
}
