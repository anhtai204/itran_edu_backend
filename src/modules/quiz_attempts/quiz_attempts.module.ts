import { Module } from '@nestjs/common';
import { QuizAttemptsService } from './quiz_attempts.service';
import { QuizAttemptsController } from './quiz_attempts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAttemptEntity } from './entities/quiz_attempt.entity';
import { QuizQuestionEntity } from '../quiz_questions/entities/quiz_question.entity';
import { QuizEntity } from '../quizzes/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAttemptEntity, QuizQuestionEntity, QuizEntity])],
  controllers: [QuizAttemptsController],
  providers: [QuizAttemptsService],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}
