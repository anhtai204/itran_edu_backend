import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryQuizService } from './category_quiz.service';
import { CreateCategoryQuizDto } from './dto/create-category_quiz.dto';
import { UpdateCategoryQuizDto } from './dto/update-category_quiz.dto';
import { Public } from '@/decorator/customize';

@Controller('category-quiz')
export class CategoryQuizController {
  constructor(private readonly categoryQuizService: CategoryQuizService) {}

  @Post()
  @Public()
  async create(@Body() createCategoryDto: CreateCategoryQuizDto) {
    return this.categoryQuizService.create(createCategoryDto);
  }

  @Get("all")
  @Public()
  findAll() {
    return this.categoryQuizService.findAll();
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryQuizDto) {
    return this.categoryQuizService.update(id, updateCategoryDto);
  }
  
  @Get("relationships")
  @Public()
  getCategoryRelationships() {
    return this.categoryQuizService.getCategoryRelationships();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryQuizService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryQuizService.remove(id);
  }


  // relationships
  @Get("all")
  @Public()
  findAllWithRelationships() {
    return this.categoryQuizService.findAllWithRelationships()
  }

  @Get('children/:id')
  @Public()
  getChildrenOfCategory(@Param('id') id: string) {
    return this.categoryQuizService.getChildrenOfCategory(id);
  }
}
