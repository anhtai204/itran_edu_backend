import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { BlockData } from '../entities/post.entity';

export class UpdatePostDto {
  @IsNotEmpty({ message: 'id is required' })
  id: string;

  @IsOptional()
  author_id: string;

  @IsOptional()
  @IsNotEmpty({ message: 'content is required' })
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  post_status: string;

  @IsOptional()
  @IsString()
  visibility: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  categories_id?: string[];

  @IsOptional()
  tags_id?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'comment_status must be a boolean' })
  comment_status?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'ping_status must be a boolean' })
  ping_status?: boolean;

  @IsOptional()
  update_at?: Date;

  @IsOptional()
  create_at?: Date;

  @IsOptional()
  @IsString()
  feature_image?: string;

  @IsOptional()
  scheduled_at?: Date;

  @IsOptional()
  blocks_data?: BlockData[];
}
