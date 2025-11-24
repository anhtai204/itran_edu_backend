import { Injectable } from '@nestjs/common';
import { CreateQuizAnswerDto } from './dto/create-quiz_answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz_answer.dto';

@Injectable()
export class QuizAnswersService {
  create(createQuizAnswerDto: CreateQuizAnswerDto) {
    return 'This action adds a new quizAnswer';
  }

  findAll() {
    return `This action returns all quizAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizAnswer`;
  }

  update(id: number, updateQuizAnswerDto: UpdateQuizAnswerDto) {
    return `This action updates a #${id} quizAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizAnswer`;
  }
}
