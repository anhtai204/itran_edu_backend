import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Entity } from 'typeorm';
import { BlockData } from '../entities/news.entity';

@Entity('news')
export class CreateNewsDto {
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
  news_status: string;

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

  @IsOptional()
  update_at?: Date;

  @IsOptional()
  create_at?: Date;

  @IsOptional()
  feature_image?: string;

  @IsOptional()
  blocks_data?: BlockData[];
}
