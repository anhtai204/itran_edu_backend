import { PartialType } from '@nestjs/mapped-types';
import { CreatePostTagDto } from './create-post_tag.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostTagDto extends PartialType(CreatePostTagDto) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  slug: string;
}
