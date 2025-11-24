import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { QuizEntity } from './entities/quiz.entity';
import { QuizQuestionEntity } from '../quiz_questions/entities/quiz_question.entity';
import { QuizAttemptEntity } from '../quiz_attempts/entities/quiz_attempt.entity';
import { QuestionSnapshotEntity } from '../question_snapshots/entities/question_snapshot.entity';
import { AttemptAnswerEntity } from '../attempt_answers/entities/attempt_answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizEntity, QuizQuestionEntity, QuizAttemptEntity, QuestionSnapshotEntity, AttemptAnswerEntity]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
