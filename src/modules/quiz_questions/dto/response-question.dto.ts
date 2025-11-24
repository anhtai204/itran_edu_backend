import { IsNotEmpty, IsString } from "class-validator";

export type QuizQuestionContent =
  | { options: { id: string; text: string; is_correct: boolean }[] } // single-choice, multiple-choice
  | { correct_answer: boolean } // true-false
  | { pairs: { item: string; match: string }[] } // matching
  | { items: {id: string, text: string}[], matches: {id: string, text: string}[], correct_matches: {item_id: string, match_id: string}[]} // matching
  | { pairs: { image_url: string; label: string }[] } // image-matching
  | { labels: {id: string, text: string}[], image_urls: {id: string, url: string}[], correct_image_matches: {label_id: string, url_id: string}[]} // image maching save
  // | { answers: string[] }; // fill-blanks
  | { answers: {id: string, text: string}[], correct_answers: string[] }; // fill-blanks
  

export class ResponseQuestionDto {
  @IsString()
  id: string;
  question_text: string;
  question_type: string;

  @IsNotEmpty()
  content: QuizQuestionContent;

  points: number;

  question_order: number;
}
