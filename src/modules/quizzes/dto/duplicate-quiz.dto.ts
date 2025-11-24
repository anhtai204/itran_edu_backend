import { IsString, IsOptional } from 'class-validator';

export class DuplicateQuizDto {
    @IsOptional()
    @IsString()
    title?: string;
}
