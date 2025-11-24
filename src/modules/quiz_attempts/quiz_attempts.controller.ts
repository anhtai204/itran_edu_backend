import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizAttemptsService } from './quiz_attempts.service';
import { CreateQuizAttemptDto } from './dto/create-quiz_attempt.dto';
import { UpdateQuizAttemptDto } from './dto/update-quiz_attempt.dto';
import { Public } from '@/decorator/customize';
import { SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';
import { QuizAttemptEntity } from './entities/quiz_attempt.entity';

@Controller('quiz-attempts')
export class QuizAttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Post()
  @Public()
  create(@Body() createQuizAttemptDto: CreateQuizAttemptDto) {
    return this.quizAttemptsService.create(createQuizAttemptDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.quizAttemptsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.quizAttemptsService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateQuizAttemptDto: UpdateQuizAttemptDto) {
    return this.quizAttemptsService.update(+id, updateQuizAttemptDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.quizAttemptsService.remove(+id);
  }


  // API nộp bài
  @Post('submit')
  @Public()
  async submitQuizAttempt(@Body() dto: SubmitQuizAttemptDto): Promise<QuizAttemptEntity> {
    return this.quizAttemptsService.submitQuizAttempt(dto);
  }

  // API lấy lịch sử làm bài của người dùng
  @Get('user/:userId')
  @Public()
  async getUserAttempts(@Param('userId') userId: string): Promise<QuizAttemptEntity[]> {
    return this.quizAttemptsService.getUserAttempts(userId);
  }
}
