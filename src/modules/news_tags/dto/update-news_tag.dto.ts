import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateNewsTagDto } from './create-news_tag.dto';

export class UpdateNewsTagDto extends PartialType(CreateNewsTagDto) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  slug: string;
}
