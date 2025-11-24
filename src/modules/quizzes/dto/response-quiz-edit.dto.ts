import { ResponseQuestionDto } from '@/modules/quiz_questions/dto/response-question.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseQuizDto {
  @IsNotEmpty()
  content: ResponseQuestionDto[];

  time_limit: number;

  passing_score: number;

  title: string;
}
