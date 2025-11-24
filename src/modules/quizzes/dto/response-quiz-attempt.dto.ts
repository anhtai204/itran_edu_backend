import { QuizQuestionContent } from '@/modules/quiz_questions/entities/quiz_question.entity';
import { IsString, IsNumber, IsBoolean, IsUUID, IsDateString, IsArray, IsEnum, IsOptional } from 'class-validator';

// Enum cho loại câu hỏi
export enum QuestionType {
  SingleChoice = 'single-choice',
  MultipleChoice = 'multiple-choice',
  TrueFalse = 'true-false',
  Matching = 'matching',
  ImageMatching = 'image-matching',
  FillBlanks = 'fill-blanks',
}

// DTO cho option (dùng trong single-choice, multiple-choice)
class OptionDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

// DTO cho label (dùng trong image-matching)
class LabelDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

// DTO cho image_url (dùng trong image-matching)
class ImageUrlDto {
  @IsString()
  id: string;

  @IsString()
  url: string;
}

// DTO cho item (dùng trong matching)
class ItemDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

// DTO cho match (dùng trong matching)
class MatchDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

// DTO cho answer (dùng trong fill-blanks)
class AnswerDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

// DTO cho content của single-choice
class SingleChoiceContentDto {
  @IsArray()
  options: OptionDto[];
}

// DTO cho content của multiple-choice
class MultipleChoiceContentDto {
  @IsArray()
  options: OptionDto[];
}

// DTO cho content của true-false
class TrueFalseContentDto {
  // Không có trường nào vì content rỗng
}

// DTO cho content của matching
export class MatchingContentDto {
  @IsArray()
  items: ItemDto[];

  @IsArray()
  matches: MatchDto[];
}

// DTO cho content của image-matching
export class ImageMatchingContentDto {
  @IsArray()
  labels: LabelDto[];

  @IsArray()
  image_urls: ImageUrlDto[];
}

// DTO cho content của fill-blanks
export class FillBlanksContentDto {
  @IsArray()
  answers: AnswerDto[];
}

// DTO cho câu hỏi
export class QuizQuestionDto {
  @IsUUID()
  id: string;

  @IsString()
  question_text: string;

  @IsEnum(QuestionType)
  question_type: QuestionType;

  content:
    | SingleChoiceContentDto
    | MultipleChoiceContentDto
    | TrueFalseContentDto
    | MatchingContentDto
    | ImageMatchingContentDto
    | FillBlanksContentDto;

  @IsNumber()
  points: number;

  @IsNumber()
  question_order: number;
}

// DTO cho thông tin bài quiz
export class QuizInfoDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNumber()
  time_limit: number;

  @IsNumber()
  passing_score: number;

  @IsNumber()
  max_attempts: number;

  @IsBoolean()
  randomize_questions: boolean;

  @IsBoolean()
  show_results: boolean;

  @IsBoolean()
  show_correct_answers: boolean;

  @IsNumber()
  total_questions: number;

  @IsNumber()
  total_points: number;
}

// DTO cho thông tin lượt làm bài
export class QuizAttemptDto {
  @IsUUID()
  attempt_id: string;

  @IsDateString()
  started_at: string;
}

// DTO cho data trong response
export class QuizDataDto {
  quiz: QuizInfoDto;

  attempt: QuizAttemptDto;

  @IsArray()
  questions: QuizQuestionDto[];
}

// DTO chính cho response
export class ResponseQuizAttemptDto {
  // data: QuizDataDto;
  quiz: QuizInfoDto;

  attempt: QuizAttemptDto;

  @IsArray()
  questions: QuizQuestionDto[];
}

export interface SingleChoiceContent {
  options: Array<{ id: string; text: string; is_correct: boolean }>;
}

export interface MultipleChoiceContent {
  options: Array<{ id: string; text: string; is_correct: boolean }>;
}

export interface TrueFalseContent {
  correct_answer: boolean;
}

export interface MatchingContent {
  items: Array<{ id: string; text: string }>;
  matches: Array<{ id: string; text: string }>;
  correct_matches: Array<{ item_id: string; match_id: string }>;
}

export interface ImageMatchingContent {
  labels: Array<{ id: string; text: string }>;
  image_urls: Array<{ id: string; url: string }>;
  correct_image_matches: Array<{ url_id: string; label_id: string }>;
}

export interface FillBlanksContent {
  answers: Array<{ id: string; text: string }>;
  correct_answers: string[];
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'single-choice' | 'multiple-choice' | 'true-false' | 'matching' | 'image-matching' | 'fill-blanks';
  content: QuizQuestionContent;
  points: number;
  question_order: number;
}