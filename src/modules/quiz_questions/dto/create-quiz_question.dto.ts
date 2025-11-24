import { IsString, IsUUID, IsEnum, IsNotEmpty, IsInt, IsPositive, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

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

class ImageMatchingSaveDto {
  @IsNotEmpty()
  labels: {
    id: string,
    text: string
  }[]

  @IsNotEmpty()
  image_urls: {
    id: string,
    url: string
  }[]

  @IsNotEmpty()
  correct_image_matches: {
    label_id: string,
    url_id: string
  }[]
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

class MatchingContentDto {
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

class ImageMatchingContentSaveDto {
  @ValidateNested({ each: true })
  @Type(() => ImageMatchingSaveDto)
  content: ImageMatchingSaveDto;
}

class FillBlankSaveDto {
  @IsNotEmpty()
  answers: {
    id: string,
    text: string
  }[]

  @IsNotEmpty()
  correct_answers: string[]
}

// class FillBlankContentSaveDto {
//   @IsString({ each: true })
//   answers: string[];
// }

class FillBlankContentSaveDto {
  @ValidateNested({ each: true })
  @Type(() => FillBlankSaveDto)
  content: FillBlankSaveDto;
}

// DTO chính cho việc tạo QuizQuestion
export class CreateQuizQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  quiz_id: string;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsEnum(['single-choice', 'multiple-choice', 'true-false', 'matching', 'image-matching', 'fill-blanks'])
  @IsNotEmpty()
  question_type: string;

  @IsNotEmpty()
  // content: ChoiceContentDto | TrueFalseContentDto | MatchingContentDto | ImageMatchingContentDto | FillBlankContentDto;
  // content: ChoiceContentDto | TrueFalseContentDto | MatchingContentSaveDto | ImageMatchingContentDto | FillBlankContentDto;
  content: ChoiceContentDto | TrueFalseContentDto | MatchingContentSaveDto | ImageMatchingContentSaveDto | FillBlankContentSaveDto;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  points?: number = 1;

  @IsInt()
  @IsNotEmpty()
  question_order: number;
}