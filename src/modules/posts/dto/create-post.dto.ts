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
import { Entity } from 'typeorm';
import { BlockData } from '../entities/post.entity';

@Entity('posts')
export class CreatePostDto {
  @IsNotEmpty({ message: 'author_id is required' })
  @IsUUID()
  author_id: string;

  @IsNotEmpty({ message: 'content is required' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  post_status: string;

  @IsString()
  visibility: string;

  @IsString()
  slug: string;

  @IsOptional()
  categories_id?: string;

  @IsOptional()
  tags_id?: string;

  @IsOptional()
  scheduled_at?: Date;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'comment_status must be a boolean' })
  comment_status?: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'ping_status must be a boolean' })
  ping_status?: boolean;

  @IsOptional()
  update_at?: Date;

  @IsOptional()
  create_at?: Date;

  @IsOptional()
  feature_image?: string;

  @IsOptional()
  blocks_data?: BlockData[];
}
