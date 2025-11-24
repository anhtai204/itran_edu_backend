import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseChapterDto } from './create-course_chapter.dto';

export class UpdateCourseChapterDto extends PartialType(CreateCourseChapterDto) {}
