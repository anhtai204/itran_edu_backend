import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizAttemptDto } from './dto/create-quiz_attempt.dto';
import { UpdateQuizAttemptDto } from './dto/update-quiz_attempt.dto';
import { QuizQuestionContent, QuizQuestionEntity } from '../quiz_questions/entities/quiz_question.entity';
import { SubmitQuizAnswerDto, SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';
import { QuizAttemptEntity } from './entities/quiz_attempt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from '../quizzes/entities/quiz.entity';

@Injectable()
export class QuizAttemptsService {
  constructor(
    @InjectRepository(QuizAttemptEntity)
    private readonly quizAttemptRepository: Repository<QuizAttemptEntity>,
    @InjectRepository(QuizQuestionEntity)
    private readonly quizQuestionRepository: Repository<QuizQuestionEntity>,
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
  ) {}
  create(createQuizAttemptDto: CreateQuizAttemptDto) {
    return 'This action adds a new quizAttempt';
  }

  findAll() {
    return this.quizAttemptRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} quizAttempt`;
  }

  update(id: number, updateQuizAttemptDto: UpdateQuizAttemptDto) {
    return `This action updates a #${id} quizAttempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizAttempt`;
  }


  // Nộp bài và tính điểm
  async submitQuizAttempt(dto: SubmitQuizAttemptDto): Promise<QuizAttemptEntity> {
    const quiz = await this.quizRepository.findOne({
      where: { id: dto.quiz_id, status: 'published' },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found or not published');
    }

    const attemptCount = await this.quizAttemptRepository.count({
      where: { quiz_id: dto.quiz_id, user_id: dto.user_id },
    });
    if (attemptCount >= quiz.max_attempts) {
      throw new BadRequestException('Maximum attempts reached');
    }

    const questions = await this.quizQuestionRepository.find({
      where: { quiz_id: dto.quiz_id },
    });

    let totalScore = 0;
    const details = {
      questions: dto.answers.map((answer: SubmitQuizAnswerDto) => {
        const question = questions.find((q) => q.id === answer.question_id);
        if (!question) {
          throw new BadRequestException(`Question ${answer.question_id} not found`);
        }

        const isCorrect = this.checkAnswer(question, answer.user_answer);
        const points = isCorrect ? question.points : 0;
        totalScore += points;

        return {
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          content: this.stripCorrectAnswers(question.content, question.question_type),
          user_answer: answer.user_answer,
          is_correct: isCorrect,
          points,
        };
      }),
    };

    const attempt = this.quizAttemptRepository.create({
      // quiz_id: dto.quiz_id,
      // user_id: dto.user_id,
      // score: totalScore,
      // start_time: new Date(),
      // end_time: new Date(),
      // status: totalScore >= quiz.passing_score ? 'completed' : 'failed',
      // created_at: new Date(),
      // updated_at: new Date(),
    });

    return this.quizAttemptRepository.save(attempt);
  }

  async getUserAttempts(user_id: string): Promise<QuizAttemptEntity[]> {
    return this.quizAttemptRepository.find({ where: { user_id } });
  }

  private stripCorrectAnswers(content: QuizQuestionContent, question_type: string): Partial<QuizQuestionContent> {
    switch (question_type) {
      case 'single-choice':
      case 'multiple-choice':
        return {
          options: (content as { options: { id: string; text: string; is_correct: boolean }[] }).options.map(
            (opt) => ({
              id: opt.id,
              text: opt.text,
              is_correct: false, // Default value for 'is_correct'
            }),
          ) as { id: string; text: string; is_correct: boolean }[],
        };
      case 'true-false':
        return { options: [] }
      case 'matching':
        return {
          items: (content as { items: { id: string; text: string }[] }).items,
          matches: (content as { matches: { id: string; text: string }[] }).matches
        };
      case 'image-matching':
        return {
          labels: (content as { labels: { id: string; text: string }[] }).labels,
          image_urls: (content as { image_urls: { id: string; url: string }[] }).image_urls
        };
      case 'fill-blanks':
        // return { answers: (content as { answers: string[] }).answers };
      default:
        return content;
    }
  }

  private checkAnswer(question: QuizQuestionEntity, user_answer: any): boolean {
    switch (question.question_type) {
      case 'single-choice':
        const singleChoiceContent = question.content as { options: { id: string; is_correct: boolean }[] };
        return (
          Array.isArray(user_answer) &&
          user_answer.length === 1 &&
          singleChoiceContent.options.find((opt) => opt.id === user_answer[0])?.is_correct
        );
      case 'multiple-choice':
        const multipleChoiceContent = question.content as {
          options: { id: string; is_correct: boolean }[];
        };
        const correctIds = multipleChoiceContent.options
          .filter((opt) => opt.is_correct)
          .map((opt) => opt.id);
        return (
          Array.isArray(user_answer) &&
          user_answer.length === correctIds.length &&
          user_answer.every((id: string) => correctIds.includes(id))
        );
      case 'true-false':
        const trueFalseContent = question.content as { correct_answer: boolean };
        return user_answer === trueFalseContent.correct_answer;
      case 'matching':
        const matchingContent = question.content as { items: { id: string; text: string }[]; matches: { id: string; text: string }[]; correct_matches: { item_id: string; match_id: string }[] };
        const correctMatches = matchingContent.correct_matches.map((pair) => ({
          item_id: pair.item_id,
          match_id: pair.match_id,
        }));
        return JSON.stringify(user_answer) === JSON.stringify(correctMatches);
      case 'image-matching':
        const imageMatchingContent = question.content as { labels: { id: string; text: string }[]; image_urls: { id: string; url: string }[]; correct_image_matches: { label_id: string; url_id: string }[] };
        const correctImageMatches = imageMatchingContent.correct_image_matches.map((pair) => ({
          label_id: pair.label_id,
          url_id: pair.url_id,
        }));
        return JSON.stringify(user_answer) === JSON.stringify(correctImageMatches);
      // case 'fill-blanks':
      //   const fillBlanksContent = question.content as { answers: string[] };
      //   return JSON.stringify(user_answer) === JSON.stringify(fillBlanksContent.answers);
      default:
        return false;
    }
  }
}
