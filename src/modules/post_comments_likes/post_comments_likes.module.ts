import { Module } from '@nestjs/common';
import { PostCommentsLikesService } from './post_comments_likes.service';
import { PostCommentsLikesController } from './post_comments_likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostCommentLikes, PostCommentLikesSchema } from './schema/post_comments_like.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentLikeEntity } from './entities/post_comments_like.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: PostCommentLikes.name, schema: PostCommentLikesSchema}]),
  TypeOrmModule.forFeature([PostCommentLikeEntity])],
  controllers: [PostCommentsLikesController],
  providers: [PostCommentsLikesService],
  exports: [PostCommentsLikesService],
})
export class PostCommentsLikesModule {}