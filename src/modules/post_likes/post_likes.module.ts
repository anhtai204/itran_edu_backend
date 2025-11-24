import { Module } from '@nestjs/common';
import { PostLikesService } from './post_likes.service';
import { PostLikesController } from './post_likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostLikes, PostLikesSchema } from './schema/post_like.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeEntity } from './entities/post_like.entity';


@Module({
  imports: [MongooseModule.forFeature([{ name: PostLikes.name, schema: PostLikesSchema}]),
  TypeOrmModule.forFeature([PostLikeEntity])],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [PostLikesService], // Export the service to be used in other modules if needed
})
export class PostLikesModule {}