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
import { PostTagsService } from './post_tags.service';
import { Public } from '@/decorator/customize';
import { CreatePostTagDto } from './dto/create-post_tag.dto';
import { UpdatePostTagDto } from './dto/update-post_tag.dto';

@Controller('post-tags')
export class PostTagsController {
  constructor(private readonly postTagsService: PostTagsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostTagDto) {
    return this.postTagsService.create(createPostDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.postTagsService.findAll();
  }

  @Get('paginate')
  @Public()
  findAllWithPaginate(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.postTagsService.findAllWithPaginate(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postTagsService.findOne(id);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string) {
    return this.postTagsService.deleteById(id);
  }

  @Patch()
  updatePostgres(@Body() updatePostTagDto: UpdatePostTagDto) {
    return this.postTagsService.updatePostTag(updatePostTagDto);
  }
}
