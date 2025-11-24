import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz_question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz_question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entities/quiz_question.entity';
import { Repository } from 'typeorm';
import { DuplicateQuizQuestionDto } from './dto/duplicate-quiz_question.dto';
import { QuizEntity } from '../quizzes/entities/quiz.entity';

@Injectable()
export class QuizQuestionsService {
  constructor(
    @InjectRepository(QuizQuestionEntity)
    private readonly quizQuestionRepository: Repository<QuizQuestionEntity>,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
  ) {}

  private validateQuizQuestion(dto: CreateQuizQuestionDto): void {
    const { question_type, content } = dto;

    // Kiểm tra content dựa trên question_type
    switch (question_type) {
      case 'single-choice':
      case 'multiple-choice':
        const options = (
          content as {
            options: { id: string; text: string; is_correct: boolean }[];
          }
        ).options;
        if (!options || options.length < 2) {
          throw new BadRequestException(
            `${question_type} must have at least 2 options`,
          );
        }
        if (!options.some((opt) => opt.is_correct)) {
          throw new BadRequestException(
            `${question_type} must have at least one correct option`,
          );
        }
        break;
      case 'true-false':
        if (
          typeof (content as { correct_answer: boolean }).correct_answer !==
          'boolean'
        ) {
          throw new BadRequestException(
            'True/False question must have a boolean correct_answer',
          );
        }
        break;
      case 'matching':
        const { items, matches, correct_matches } = content as unknown as {
          items: { id: string; text: string }[];
          matches: { id: string; text: string }[];
          correct_matches: { item_id: string; match_id: string }[];
        };

        if (!items || items.length < 2) {
          throw new BadRequestException(
            'Matching question must have at least 2 items',
          );
        }
        if (!matches || matches.length < 2) {
          throw new BadRequestException(
            'Matching question must have at least 2 matches',
          );
        }
        if (
          !correct_matches ||
          correct_matches.length < 2 ||
          !correct_matches.every(
            (pair) =>
              items.some((item) => item.id === pair.item_id) &&
              matches.some((match) => match.id === pair.match_id),
          )
        ) {
          throw new BadRequestException(
            'Matching question must have at least 2 valid correct_matches',
          );
        }
        break;
      case 'image-matching':
        // const imagePairs = (
        //   content as { pairs: { image_url: string; label: string }[] }
        // ).pairs;
        // if (!imagePairs || imagePairs.length < 2) {
        //   throw new BadRequestException(
        //     'Image Matching question must have at least 2 pairs',
        //   );
        // }
        // break;
        const { labels, image_urls, correct_image_matches } = content as unknown as {
          labels: { id: string; text: string }[];
          image_urls: { id: string; url: string }[];
          correct_image_matches: { label_id: string; url_id: string }[];
        };
        if (!labels || labels.length < 2) {
          throw new BadRequestException(
            'Image Matching question must have at least 2 labels',
          );
        }
        if (!image_urls || image_urls.length < 2) {
          throw new BadRequestException(
            'Image Matching question must have at least 2 image URLs',
          );
        }
        break;
      case 'fill-blanks':
        const { answers, correct_answers } = content as unknown as { 
          answers: {id: string, text: string}[], 
          correct_answers: string[] 
        };
        if (!answers || answers.length === 0) {
          throw new BadRequestException(
            'Fill-in-the-blanks question must have at least one answer',
          );
        }
        break;
      default:
        throw new BadRequestException('Invalid question_type');
    }
  }

  // async create(
  //   createQuizQuestionDto: CreateQuizQuestionDto,
  // ): Promise<QuizQuestionEntity> {
  //   this.validateQuizQuestion(createQuizQuestionDto);

  //   // Tạo entity từ DTO
  //   const { content, ...rest } = createQuizQuestionDto;
  //   const quizQuestion = this.quizQuestionRepository.create({
  //     ...rest,
  //     content: content as any, // Cast to any or to the entity's expected type if possible
  //   });

  //   // Lưu vào database
  //   return await this.quizQuestionRepository.save(quizQuestion);
  // }

  async create(
    createQuizQuestionDto: CreateQuizQuestionDto,
  ): Promise<QuizQuestionEntity> {
    this.validateQuizQuestion(createQuizQuestionDto);

    // Tạo entity từ DTO
    const { content, ...rest } = createQuizQuestionDto;
    const quizQuestion = this.quizQuestionRepository.create({
      ...rest,
      content: content as any, // Cast to any or to the entity's expected type if possible
    });

    // Lưu vào database
    return await this.quizQuestionRepository.save(quizQuestion);
  }

  findAll() {
    return this.quizQuestionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} quizQuestion`;
  }

  // update(id: string, updateQuizQuestionDto: UpdateQuizQuestionDto) {
  //   const quiz = this.quizQuestionRepository.findOne({ where: { id } });
  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found');
  //   }
  //   return this.quizQuestionRepository.update(id, updateQuizQuestionDto);
  // }

  async update(id: string, updateQuizQuestionDto: UpdateQuizQuestionDto) {
    const quiz = await this.quizQuestionRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    // Ensure content is cast to the expected type for the entity
    const { content, ...rest } = updateQuizQuestionDto;
    return this.quizQuestionRepository.update(id, {
      ...rest,
      content: content as any, // Cast to any or the entity's expected type if possible
    });
  }


  async remove(
    id: string,
  ): Promise<{ statusCode: number; message: string; data: null }> {
    try {
      const question = await this.quizQuestionRepository.findOne({
        where: { id },
      });
      if (!question) {
        throw new NotFoundException('Question not found');
      }

      await this.quizQuestionRepository.delete(id);

      return {
        statusCode: 200,
        message: 'Question deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete question: ${error.message}`,
      );
    }
  }

  async bulkUpdate(
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
    const updatedQuestions = [];
    for (const q of questions) {
      const question = await this.quizQuestionRepository.findOne({
        where: { id: q.id },
      });
      if (question) {
        await this.quizQuestionRepository.update(q.id, {
          quiz_id: q.quiz_id,
          question_text: q.question_text,
          question_type: q.question_type,
          content: q.content,
          explanation: q.explanation,
          points: q.points,
          question_order: q.question_order,
        });
        updatedQuestions.push(
          await this.quizQuestionRepository.findOne({ where: { id: q.id } }),
        );
      }
    }
    return updatedQuestions;
  }

  async duplicate(
    questionId: string,
    duplicateQuizQuestionDto: DuplicateQuizQuestionDto,
  ): Promise<{
    statusCode: number;
    message: string;
    data: QuizQuestionEntity;
  }> {
    try {
      const { question_text } = duplicateQuizQuestionDto;

      // Find the existing question
      const existingQuestion = await this.quizQuestionRepository.findOne({
        where: { id: questionId },
      });

      if (!existingQuestion) {
        throw new NotFoundException('Question not found');
      }

      // Validate quiz_id
      const quiz = await this.quizRepository.findOne({
        where: { id: existingQuestion.quiz_id },
      });
      if (!quiz) {
        throw new BadRequestException('Associated quiz not found');
      }

      // Get max question_order
      const maxOrderResult = await this.quizQuestionRepository
        .createQueryBuilder('question')
        .where('question.quiz_id = :quizId', {
          quizId: existingQuestion.quiz_id,
        })
        .select('MAX(question.question_order)', 'max')
        .getRawOne();
      const newOrder = (maxOrderResult?.max || 0) + 1;

      // Create duplicate question
      const duplicateQuestion = this.quizQuestionRepository.create({
        quiz_id: existingQuestion.quiz_id,
        question_text:
          question_text || `${existingQuestion.question_text} (Copy)`,
        question_type: existingQuestion.question_type,
        content: JSON.parse(JSON.stringify(existingQuestion.content)), // Deep copy
        explanation: existingQuestion.explanation,
        points: existingQuestion.points,
        question_order: newOrder,
        // created_at and updated_at use database defaults
      });

      const savedQuestion =
        await this.quizQuestionRepository.save(duplicateQuestion);

      return {
        statusCode: 200,
        message: 'Question duplicated successfully',
        data: savedQuestion,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to duplicate question: ${error.message}`,
      );
    }
  }
}
