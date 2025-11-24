import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaFileDto } from './create-media_file.dto';

export class UpdateMediaFileDto extends PartialType(CreateMediaFileDto) {}
