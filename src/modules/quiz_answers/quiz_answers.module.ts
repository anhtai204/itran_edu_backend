import { Module } from '@nestjs/common';
import { QuizAnswersService } from './quiz_answers.service';
import { QuizAnswersController } from './quiz_answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAnswerEntity } from './entities/quiz_answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAnswerEntity])],
  controllers: [QuizAnswersController],
  providers: [QuizAnswersService],
  exports: [QuizAnswersService],
})
export class QuizAnswersModule {}
