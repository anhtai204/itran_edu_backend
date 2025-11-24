import { Module } from '@nestjs/common';
import { QuizQuestionsService } from './quiz_questions.service';
import { QuizQuestionsController } from './quiz_questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entities/quiz_question.entity';
import { QuizEntity } from '../quizzes/entities/quiz.entity';


@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestionEntity, QuizEntity])],
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsService],
  exports: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
