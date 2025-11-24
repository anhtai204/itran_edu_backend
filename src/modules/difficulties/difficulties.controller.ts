import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';
import { Public } from '@/decorator/customize';

@Controller('difficulties')
export class DifficultiesController {
  constructor(private readonly difficultiesService: DifficultiesService) {}


  @Post()
  @Public()
  create(@Body() createDifficultyDto: CreateDifficultyDto) {
    return this.difficultiesService.create(createDifficultyDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.difficultiesService.findAll();
  }

  @Get('paginate')
  @Public()
  findAllWithPaginate(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.difficultiesService.findAllWithPaginate(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.difficultiesService.findOne(id);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string) {
    return this.difficultiesService.deleteById(id);
  }

  @Patch()
  updateDifficulty(@Body() updateDifficultyDto: UpdateDifficultyDto) {
    return this.difficultiesService.updateDifficulty(updateDifficultyDto);
  }
}
