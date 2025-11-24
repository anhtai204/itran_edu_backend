import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseEnrollmentDto } from './create-course_enrollment.dto';

export class UpdateCourseEnrollmentDto extends PartialType(CreateCourseEnrollmentDto) {}
