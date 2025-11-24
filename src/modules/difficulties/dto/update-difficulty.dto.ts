

import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateDifficultyDto } from './create-difficulty.dto';

export class UpdateDifficultyDto extends PartialType(CreateDifficultyDto) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;
}
