export class CreateQuestionSnapshotDto {
  quiz_id: string;
  attempt_id: string;
  question_id: string;
  content: string;
  options: any;
  correct_answer: any;
  question_type: string;
  points: number;
  question_order: number;
}
