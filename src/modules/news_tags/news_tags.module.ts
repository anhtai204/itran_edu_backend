import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTag, NewsTagSchema } from './schema/news_tag.schema';
import { NewsTagsEntity } from './entities/news_tag.entity';
import { NewsTagsController } from './news_tags.controller';
import { NewsTagsService } from './news_tags.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: NewsTag.name, schema: NewsTagSchema}]),
  TypeOrmModule.forFeature([NewsTagsEntity])],
  controllers: [NewsTagsController],
  providers: [NewsTagsService],
  exports: [NewsTagsService],
})
export class NewsTagsModule {}

