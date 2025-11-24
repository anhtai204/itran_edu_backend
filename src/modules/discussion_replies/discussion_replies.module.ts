import { Module } from '@nestjs/common';
import { DiscussionRepliesService } from './discussion_replies.service';
import { DiscussionRepliesController } from './discussion_replies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionReply, DiscussionReplySchema } from './schema/discussion_reply.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionReplyEntity } from './entities/discussion_reply.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: DiscussionReply.name, schema: DiscussionReplySchema}]),
  TypeOrmModule.forFeature([DiscussionReplyEntity])],
  controllers: [DiscussionRepliesController],
  providers: [DiscussionRepliesService],
  exports: [DiscussionRepliesService],
})

export class DiscussionRepliesModule {}
