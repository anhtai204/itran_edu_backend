import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { QuizQuestionsService } from './quiz_questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz_question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz_question.dto';
import { Public } from '@/decorator/customize';
import { DuplicateQuizQuestionDto } from './dto/duplicate-quiz_question.dto';

@Controller('quiz-questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  @Post('create')
  @Public()
  create(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
    return this.quizQuestionsService.create(createQuizQuestionDto);
  }

  @Post('duplicate/:id')
  @Public()
  async duplicate(
    @Param('id') id: string,
    @Body() duplicateQuizQuestionDto: DuplicateQuizQuestionDto,
  ) {
    const quiz = await this.quizQuestionsService.duplicate(
      id,
      duplicateQuizQuestionDto,
    );
    return quiz;
  }

  @Get()
  @Public()
  findAll() {
    return this.quizQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizQuestionsService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  update(
    @Param('id') id: string,
    @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
  ) {
    return this.quizQuestionsService.update(id, updateQuizQuestionDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.quizQuestionsService.remove(id);
  }

  @Put('bulk-update')
  @Public()
  async bulkUpdate(
    @Body()
    questions: Array<{
      id: string;
      quiz_id: string;
      question_text: string;
      question_type: string;
      content: any;
      explanation: string;
      points: number;
      question_order: number;
    }>,
  ) {
    console.log('Received bulk update:', questions);
    return this.quizQuestionsService.bulkUpdate(questions);
  }
}
