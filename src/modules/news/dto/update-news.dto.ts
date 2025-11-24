import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { BlockData } from '../entities/news.entity';

export class UpdateNewsDto {
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
  news_status: string;

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
