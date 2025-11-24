import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateQuizDto {
  @IsOptional()
  @IsUUID()
  lesson_id?: string;

  @IsNotEmpty({ message: 'author_id is required' })
  @IsUUID()
  author_id: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsUUID()
  difficulty_id?: string;

  @IsOptional()
  @IsInt()
  time_limit?: number;

  @IsOptional()
  @IsInt()
  passing_score?: number;

  @IsOptional()
  @IsInt()
  max_attempts?: number;

  @IsOptional()
  @IsBoolean()
  randomize_questions?: boolean;

  @IsOptional()
  @IsBoolean()
  show_results?: boolean;

  @IsOptional()
  @IsBoolean()
  show_correct_answers?: boolean;

  @IsOptional()
  @IsBoolean()
  show_explanations?: boolean;

  @IsOptional()
  @IsString()
  status: 'draft' | 'published';
}
