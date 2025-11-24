import { IsString, IsOptional } from 'class-validator';

export class DuplicateQuizQuestionDto {
    @IsOptional()
    @IsString()
    question_text?: string;
}
