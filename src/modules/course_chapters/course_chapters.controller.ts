import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseChaptersService } from './course_chapters.service';
import { CreateCourseChapterDto } from './dto/create-course_chapter.dto';
import { UpdateCourseChapterDto } from './dto/update-course_chapter.dto';

@Controller('course-chapters')
export class CourseChaptersController {
  constructor(private readonly courseChaptersService: CourseChaptersService) {}

  @Post()
  create(@Body() createCourseChapterDto: CreateCourseChapterDto) {
    return this.courseChaptersService.create(createCourseChapterDto);
  }

  @Get()
  findAll() {
    return this.courseChaptersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseChaptersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseChapterDto: UpdateCourseChapterDto) {
    return this.courseChaptersService.update(+id, updateCourseChapterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseChaptersService.remove(+id);
  }
}
