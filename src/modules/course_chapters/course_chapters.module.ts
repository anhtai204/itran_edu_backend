import { Module } from '@nestjs/common';
import { CourseChaptersService } from './course_chapters.service';
import { CourseChaptersController } from './course_chapters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseChapter, CourseChapterSchema } from './schema/course_chapter.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseChapterEntity } from './entities/course_chapter.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: CourseChapter.name, schema: CourseChapterSchema}]),
  TypeOrmModule.forFeature([CourseChapterEntity])],
  controllers: [CourseChaptersController],
  providers: [CourseChaptersService],
  exports: [CourseChaptersService],
})

export class CourseChaptersModule {}
