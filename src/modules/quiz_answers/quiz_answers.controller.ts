import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizAnswersService } from './quiz_answers.service';
import { CreateQuizAnswerDto } from './dto/create-quiz_answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz_answer.dto';

@Controller('quiz-answers')
export class QuizAnswersController {
  constructor(private readonly quizAnswersService: QuizAnswersService) {}

  @Post()
  create(@Body() createQuizAnswerDto: CreateQuizAnswerDto) {
    return this.quizAnswersService.create(createQuizAnswerDto);
  }

  @Get()
  findAll() {
    return this.quizAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizAnswerDto: UpdateQuizAnswerDto) {
    return this.quizAnswersService.update(+id, updateQuizAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizAnswersService.remove(+id);
  }
}
