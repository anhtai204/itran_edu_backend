import { Module } from '@nestjs/common';
import { PostCommentsService } from './post_comments.service';
import { PostCommentsController } from './post_comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostComment, PostCommentSchema } from './schema/post_comment.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentEntity } from './entities/post_comment.entity';
import { PostCommentLikeEntity } from '../post_comments_likes/entities/post_comments_like.entity';
import { UserEntity } from '../users/entities/users.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: PostComment.name, schema: PostCommentSchema}]),
  TypeOrmModule.forFeature([PostCommentEntity, PostCommentLikeEntity, UserEntity])],
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
  exports: [PostCommentsService],
})
export class PostCommentsModule {}