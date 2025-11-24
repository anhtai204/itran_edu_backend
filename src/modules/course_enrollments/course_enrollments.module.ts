import { Module } from '@nestjs/common';
import { CourseEnrollmentsService } from './course_enrollments.service';
import { CourseEnrollmentsController } from './course_enrollments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseEnrollment, CourseEnrollmentSchema } from './schema/course_enrollment.schema';
import { CourseEnrollmentEntity } from './entities/course_enrollment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MongooseModule.forFeature([{ name: CourseEnrollment.name, schema: CourseEnrollmentSchema}]),
  TypeOrmModule.forFeature([CourseEnrollmentEntity])],
  controllers: [CourseEnrollmentsController],
  providers: [CourseEnrollmentsService],
  exports: [CourseEnrollmentsService],
})

export class CourseEnrollmentsModule {}
