
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryQuizDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  parent_id?: string;
}