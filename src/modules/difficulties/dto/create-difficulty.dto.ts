import { IsNotEmpty, IsString, IsOptional} from 'class-validator';
import {
  Entity,
} from 'typeorm';

@Entity('difficulties')
export class CreateDifficultyDto {
    @IsNotEmpty({ message: "name is required" })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;
}
