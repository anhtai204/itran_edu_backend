import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizAnswerDto } from './create-quiz_answer.dto';

export class UpdateQuizAnswerDto extends PartialType(CreateQuizAnswerDto) {}
