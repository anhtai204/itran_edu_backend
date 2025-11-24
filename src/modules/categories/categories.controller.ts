import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Public } from '@/decorator/customize';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Public()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get("all")
  @Public()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }


  
  @Get("relationships")
  @Public()
  getCategoryRelationships() {
    return this.categoriesService.getCategoryRelationships();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }


  // relationships
  @Get("all")
  @Public()
  findAllWithRelationships() {
    return this.categoriesService.findAllWithRelationships()
  }

  @Get('children/:id')
  @Public()
  getChildrenOfCategory(@Param('id') id: string) {
    return this.categoriesService.getChildrenOfCategory(id);
  }
}
