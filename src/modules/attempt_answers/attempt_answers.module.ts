import { Module } from '@nestjs/common';
import { AttemptAnswersService } from './attempt_answers.service';
import { AttemptAnswersController } from './attempt_answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptAnswerEntity } from './entities/attempt_answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptAnswerEntity])],
  controllers: [AttemptAnswersController],
  providers: [AttemptAnswersService],
  exports: [AttemptAnswersService],
})
export class AttemptAnswersModule {}
