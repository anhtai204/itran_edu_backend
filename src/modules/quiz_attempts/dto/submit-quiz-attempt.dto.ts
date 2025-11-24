import { IsUUID, IsArray, IsNotEmpty } from 'class-validator';

export class SubmitQuizAnswerDto {
  @IsUUID()
  question_id: string;

  @IsNotEmpty()
  user_answer: any; // Có thể là array, boolean, hoặc string tùy question_type
}

export class SubmitQuizAttemptDto {
  @IsUUID()
  quiz_id: string;

  @IsUUID()
  user_id: string;

  @IsArray()
  answers: SubmitQuizAnswerDto[];
}