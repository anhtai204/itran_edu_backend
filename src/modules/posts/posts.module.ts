import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schema/post.schema";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { UserEntity } from "../users/entities/users.entity";
import { CategoryEntity } from "../categories/entities/category.entity";


@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema}]),
  TypeOrmModule.forFeature([PostEntity, UserEntity, CategoryEntity])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
