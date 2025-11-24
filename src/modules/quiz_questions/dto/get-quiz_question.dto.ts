import { IsUUID } from 'class-validator';

export class GetQuizQuestionsDto {
  @IsUUID()
  quiz_id: string;
}