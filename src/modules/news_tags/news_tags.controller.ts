import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Public } from '@/decorator/customize';
import { NewsTagsService } from './news_tags.service';
import { CreateNewsTagDto } from './dto/create-news_tag.dto';
import { UpdateNewsTagDto } from './dto/update-news_tag.dto';

@Controller('news-tags')
export class NewsTagsController {
  constructor(private readonly newsTagsService: NewsTagsService) {}

  @Post()
  @Public()
  create(@Body() createNewsTagDto: CreateNewsTagDto) {
    return this.newsTagsService.create(createNewsTagDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.newsTagsService.findAll();
  }

  @Get('paginate')
  @Public()
  findAllWithPaginate(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.newsTagsService.findAllWithPaginate(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsTagsService.findOne(id);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string) {
    return this.newsTagsService.deleteById(id);
  }

  @Patch()
  updatePostgres(@Body() updateNewsTagDto: UpdateNewsTagDto) {
    return this.newsTagsService.updateNewsTag(updateNewsTagDto);
  }
}
