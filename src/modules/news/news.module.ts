import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/users.entity";
import { CategoryEntity } from "../categories/entities/category.entity";
import { News, NewsSchema } from "./schema/news.schema";
import { NewsEntity } from "./entities/news.entity";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: News.name, schema: NewsSchema}]),
  TypeOrmModule.forFeature([NewsEntity, UserEntity, CategoryEntity])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
