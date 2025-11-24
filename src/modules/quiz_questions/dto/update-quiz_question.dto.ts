import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizQuestionDto } from './create-quiz_question.dto';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


// Định nghĩa các type cho QuizQuestionContent
export type QuizQuestionContent =
  | { options: { id: string; text: string; is_correct: boolean }[] } // single-choice, multiple-choice
  | { correct_answer: boolean } // true-false
  | { pairs: { item: string; match: string }[] } // matching
  | { pairs: { image_url: string; label: string }[] } // image-matching
  | { answers: string[] }; // fill-blanks

// DTO con cho options (single-choice, multiple-choice)
class OptionDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  is_correct: boolean;
}

// DTO con cho matching pairs
class MatchingPairDto {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsString()
  @IsNotEmpty()
  match: string;
}

class MatchingSaveDto {
  @IsNotEmpty()
  items: {
    id: string;
    text: string;
  }[];

  @IsNotEmpty()
  matches: {
    id: string;
    text: string;
  }[];

  @IsNotEmpty()
  correct_matches: {
    item_id: string;
    match_id: string;
  }[];
}

// DTO con cho image-matching pairs
class ImageMatchingPairDto {
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  label: string;
}

class ChoiceContentDto {
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}


class TrueFalseContentDto {
  @IsBoolean()
  correct_answer: boolean;
}

// class MatchingContentDto {
//   @ValidateNested({ each: true })
//   @Type(() => MatchingPairDto)
//   pairs: MatchingPairDto[];
// }

class MatchingCSaveDto {
  @ValidateNested({ each: true })
  @Type(() => MatchingPairDto)
  pairs: MatchingPairDto[];
}

class MatchingContentSaveDto {
  @ValidateNested({ each: true })
  @Type(() => MatchingSaveDto)
  content: MatchingSaveDto;
}


class ImageMatchingContentDto {
  @ValidateNested({ each: true })
  @Type(() => ImageMatchingPairDto)
  pairs: ImageMatchingPairDto[];
}

class FillBlankContentDto {
  @IsString({ each: true })
  answers: string[];
}

export class UpdateQuizQuestionDto {
  @IsNotEmpty({ message: 'question_id is required' })
  id: string;

  @IsUUID()
  @IsNotEmpty()
  quiz_id: string;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsEnum([
    'single-choice',
    'multiple-choice',
    'true-false',
    'matching',
    'image-matching',
    'fill-blanks',
  ])
  @IsNotEmpty()
  question_type: string;

  @IsNotEmpty()
  content:
    | ChoiceContentDto
    | TrueFalseContentDto
    // | MatchingContentDto
    | MatchingContentSaveDto
    | ImageMatchingContentDto
    | FillBlankContentDto;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  points?: number = 1;

  @IsInt()
  @IsOptional()
  question_order: number;
}
