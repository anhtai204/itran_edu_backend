import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Public } from '@/decorator/customize';
import { DuplicateQuizDto } from './dto/duplicate-quiz.dto';
import { QuizQuestionEntity } from '../quiz_questions/entities/quiz_question.entity';
import { GetQuizQuestionsDto } from '../quiz_questions/dto/get-quiz_question.dto';
import { ResponseQuestionDto } from '../quiz_questions/dto/response-question.dto';
import { ResponseQuizDto } from './dto/response-quiz-edit.dto';
import { ResponseQuizAttemptDto } from './dto/response-quiz-attempt.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('create')
  @Public()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Post('duplicate/:id')
  @Public()
  async duplicate(
    @Param('id') id: string,
    @Body() duplicateQuizDto: DuplicateQuizDto,
  ) {
      const quiz = await this.quizzesService.duplicate(id, duplicateQuizDto);
      return {
        statusCode: 200,
        message: 'Quiz duplicated successfully',
        data: quiz,
      };
  }

  @Get()
  @Public()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get('published')
  @Public()
  getQuizzesPublish(){
    return this.quizzesService.getQuizzesPublish();
  }

  @Get('paginate')
  @Public()
  async getQuizzesWithPaginate(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('category') category: string,
    @Query('difficulty') difficulty: string,
  ) {
    const query = {
      search: search || '',
      status: status || '',
      category: category || '',
      difficulty: difficulty || '',
    };
    return this.quizzesService.getQuizzesWithPaginate(query, current, pageSize);
  }

  @Get(':id')
  @Public()
  findCustomQuizById(@Param('id') id: string) {
    return this.quizzesService.getQuizById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }


  // // lấy questions
  // @Get(':quizId/questions')
  // @Public()
  // async getQuizQuestions(
  //   @Param('quizId') quizId: string,
  // ): Promise<ResponseQuestionDto[]> {
  //   const dto: GetQuizQuestionsDto = { quiz_id: quizId };
  //   return this.quizzesService.getQuizQuestions(dto);
  // }

  // lấy questions
  @Get(':quizId/questions')
  @Public()
  async getQuizQuestions(
    @Param('quizId') quizId: string,
  ): Promise<ResponseQuizDto> {
    const dto: GetQuizQuestionsDto = { quiz_id: quizId };
    return this.quizzesService.getQuizQuestions(dto);
  }

  // Trả về thông tin quiz, attempt, questions
  @Post(':quizId/attempt')
  @Public()
  async getQuizAttempt(
    @Param('quizId') quizId: string,
    @Body('userId') userId: string,
  ): Promise<ResponseQuizAttemptDto> {
    return this.quizzesService.getQuizAndQuestions(quizId, userId);
  }

  // Get overview of quiz
  @Get(':quizId/overview')
  @Public()
  async getQuizOverview(@Param('quizId') quizId: string) {
    return this.quizzesService.getQuizOverview(quizId);
  }

  @Post(':quizId/submit')
  @Public()
  async submitQuizAttempt(
    @Param('quizId') quizId: string,
    @Body('attempt_id') attempt_id: string,
    @Body('answers') answers: any,
  ) {
    return this.quizzesService.submitQuizAttempt({
      quiz_id: quizId,
      attempt_id,
      answers
    });
  }
}
