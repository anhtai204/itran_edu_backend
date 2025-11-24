import { Module } from '@nestjs/common';
import { CategoryQuizService } from './category_quiz.service';
import { CategoryQuizController } from './category_quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryQuiz, CategoryQuizSchema } from './schema/category_quiz.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryQuizEntity } from './entities/category_quiz.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: CategoryQuiz.name, schema: CategoryQuizSchema}]),
  TypeOrmModule.forFeature([CategoryQuizEntity])],
  controllers: [CategoryQuizController],
  providers: [CategoryQuizService],
  exports: [CategoryQuizService],
})
export class CategoryQuizModule {}