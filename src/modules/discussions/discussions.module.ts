import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from './schema/discussion.schema';
import { DiscussionEntity } from './entities/discussion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema}]),
  TypeOrmModule.forFeature([DiscussionEntity])],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
