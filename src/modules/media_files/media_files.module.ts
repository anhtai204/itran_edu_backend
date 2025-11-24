import { Module } from '@nestjs/common';
import { MediaFilesService } from './media_files.service';
import { MediaFilesController } from './media_files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaFile, MediaFileSchema } from './schema/media_file.schema';
import { MediaFileEntity } from './entities/media_file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MongooseModule.forFeature([{ name: MediaFile.name, schema: MediaFileSchema}]),
  TypeOrmModule.forFeature([MediaFileEntity])],
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
  exports: [MediaFilesService],
})
export class MediaFilesModule {}
