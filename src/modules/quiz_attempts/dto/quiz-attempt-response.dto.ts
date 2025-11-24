import { QuizQuestionContent } from "@/modules/quiz_questions/entities/quiz_question.entity";

export class QuizAttemptQuestionResponseDto {
  question_id: string;
  question_text: string;
  question_type: string;
  content: QuizQuestionContent;
  user_answer: any;
  is_correct: boolean;
  points: number;
}

export class QuizAttemptResponseDto {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number | null;
  start_time: Date | null;
  end_time: Date | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  details: { questions: QuizAttemptQuestionResponseDto[] } | null;
}