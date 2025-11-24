import { Injectable } from '@nestjs/common';
import { CreateMediaFileDto } from './dto/create-media_file.dto';
import { UpdateMediaFileDto } from './dto/update-media_file.dto';

@Injectable()
export class MediaFilesService {
  create(createMediaFileDto: CreateMediaFileDto) {
    return 'This action adds a new mediaFile';
  }

  findAll() {
    return `This action returns all mediaFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mediaFile`;
  }

  update(id: number, updateMediaFileDto: UpdateMediaFileDto) {
    return `This action updates a #${id} mediaFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} mediaFile`;
  }
}
