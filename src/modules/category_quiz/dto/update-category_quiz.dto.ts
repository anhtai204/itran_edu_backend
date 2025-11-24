
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryQuizDto } from './create-category_quiz.dto';

export class UpdateCategoryQuizDto extends PartialType(CreateCategoryQuizDto) {
    name: string;
    slug: string;
    description: string;
    parent_id: string;
}
