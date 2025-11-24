import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MediaFilesService } from './media_files.service';
import { CreateMediaFileDto } from './dto/create-media_file.dto';
import { UpdateMediaFileDto } from './dto/update-media_file.dto';

@Controller('media-files')
export class MediaFilesController {
  constructor(private readonly mediaFilesService: MediaFilesService) {}

  @Post()
  create(@Body() createMediaFileDto: CreateMediaFileDto) {
    return this.mediaFilesService.create(createMediaFileDto);
  }

  @Get()
  findAll() {
    return this.mediaFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaFilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaFileDto: UpdateMediaFileDto) {
    return this.mediaFilesService.update(+id, updateMediaFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaFilesService.remove(+id);
  }
}
