import { Module } from '@nestjs/common';
import { PostTagsService } from './post_tags.service';
import { PostTagsController } from './post_tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostTag, PostTagSchema } from './schema/post_tag.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTagsEntity } from './entities/post_tag.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: PostTag.name, schema: PostTagSchema}]),
  TypeOrmModule.forFeature([PostTagsEntity])],
  controllers: [PostTagsController],
  providers: [PostTagsService],
  exports: [PostTagsService],
})
export class PostTagsModule {}

