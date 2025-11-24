import { IsNotEmpty, IsString, IsOptional, IsUUID, IsArray, IsBoolean } from 'class-validator';
import {
  Entity,
} from 'typeorm';

@Entity('news-tags')
export class CreateNewsTagDto {
    @IsNotEmpty({ message: "name is required" })
    @IsString()
    name: string;

    @IsNotEmpty({ message: "slug is required" })
    @IsString()
    slug: string;

    @IsOptional()
    description: string;
}
