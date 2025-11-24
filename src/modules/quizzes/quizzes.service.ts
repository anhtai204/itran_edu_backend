import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';
import { QuizQuestionContent, QuizQuestionEntity } from '../quiz_questions/entities/quiz_question.entity';
import { DuplicateQuizDto } from './dto/duplicate-quiz.dto';
import { GetQuizQuestionsDto } from '../quiz_questions/dto/get-quiz_question.dto';
import { ResponseQuestionDto } from '../quiz_questions/dto/response-question.dto';
import { ResponseQuizDto } from './dto/response-quiz-edit.dto';
import { QuizAttemptDto, QuizInfoDto, QuizQuestionDto, ResponseQuizAttemptDto, QuestionType, QuizQuestion } from './dto/response-quiz-attempt.dto';
import { QuizAttemptEntity } from '../quiz_attempts/entities/quiz_attempt.entity';
import { QuestionSnapshotsService } from '../question_snapshots/question_snapshots.service';
import { QuestionSnapshotEntity } from '../question_snapshots/entities/question_snapshot.entity';
import { AttemptAnswerEntity } from '../attempt_answers/entities/attempt_answer.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(QuizQuestionEntity)
    private readonly quizQuestionRepository: Repository<QuizQuestionEntity>,

    @InjectRepository(QuizAttemptEntity)
    private readonly quizAttemptRepository: Repository<QuizAttemptEntity>,

    @InjectRepository(QuestionSnapshotEntity)
    private readonly questionSnapshotRepository: Repository<QuestionSnapshotEntity>,

    @InjectRepository(AttemptAnswerEntity)
    private readonly attemptAnswerRepository: Repository<AttemptAnswerEntity>,

  ) {}

  async create(createQuizDto: CreateQuizDto) {
    try {
      const {
        lesson_id,
        title,
        author_id,
        description,
        category_id,
        difficulty_id,
        time_limit,
        passing_score,
        max_attempts,
        randomize_questions,
        show_results,
        show_correct_answers,
        show_explanations,
        status,
      } = createQuizDto;

      // Validate required fields
      if (!title) {
        throw new Error('Title are required');
      }
      if (!lesson_id) {
        throw new BadRequestException('Lesson is required');
      }

      // Create new news
      const quiz = this.quizRepository.create({
        lesson_id,
        title,
        author_id,
        description,
        category_id,
        difficulty_id,
        time_limit,
        passing_score,
        max_attempts,
        randomize_questions,
        show_results,
        show_correct_answers,
        show_explanations,
        status,
      });

      return await this.quizRepository.save(quiz);
    } catch (error) {
      throw new Error(`Failed to create quiz: ${error.message}`);
    }
  }

  findAll() {
    return this.quizRepository.find();
  }

  getQuizzesPublish(){
    return this.quizRepository.find({
      where: { status: 'published' },
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.quizRepository.findOne({ where: { id } });
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    try {
      const quiz = this.quizRepository.findOne({ where: { id } });
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const updatedQuiz = { ...quiz, ...updateQuizDto };
      await this.quizRepository.update(id, updatedQuiz);
      return updatedQuiz;
    } catch (error) {
      throw new Error(`Failed to update quiz: ${error.message}`);
    }
  }

  async remove(id: string): Promise<{ statusCode: number; message: string }> {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    await this.quizRepository.delete(id);
    return {
      statusCode: 200,
      message: 'Quiz deleted successfully',
    };
  }

  async getQuizzesWithPaginate(query: any, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;

    if (!current) current = 1;
    if (!pageSize) pageSize = 6;

    // Create a query builder for counting total items
    const queryBuilder = this.quizRepository.createQueryBuilder('quiz');

    // Count total items for pagination
    const totalItems = await queryBuilder.getCount();

    // Get detailed quiz data with joins
    const quizzesQuery = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoin('users', 'user', 'user.id = quiz.author_id')
      .leftJoin(
        'difficulties',
        'difficulty',
        'difficulty.id = quiz.difficulty_id',
      )
      .leftJoin('lessons', 'lesson', 'lesson.id = quiz.lesson_id')
      .leftJoin('categories', 'category', 'category.id = quiz.category_id')
      .select([
        'quiz.id AS quiz_id',
        'user.username AS author',
        'lesson.title AS lesson',
        'quiz.title AS title',
        'quiz.description AS description',
        'difficulty.name AS difficulty',
        'quiz.time_limit AS time_limit',
        'quiz.passing_score AS passing_score',
        'quiz.max_attempts AS max_attempts',
        'quiz.randomize_questions AS randomize_questions',
        'quiz.show_results AS show_results',
        'quiz.show_correct_answers AS show_correct_answers',
        'quiz.show_explanations AS show_explanations',
        'quiz.status AS status',
        'category.name AS category',
        'quiz.created_at AS created_at',
        'quiz.updated_at AS updated_at',
      ])
      .skip((current - 1) * pageSize)
      .take(pageSize);

    const quizzes = await quizzesQuery.getRawMany();

    // Lấy số lượng câu hỏi cho từng quiz
    const quizIds = quizzes.map((quiz) => quiz.quiz_id);
    const questionCounts = await this.quizQuestionRepository
      .createQueryBuilder('question')
      .select('question.quiz_id AS quiz_id, COUNT(*) AS question_count')
      .where('question.quiz_id IN (:...quizIds)', { quizIds })
      .groupBy('question.quiz_id')
      .getRawMany();

    // Tạo map để tra cứu số câu hỏi theo quiz_id
    const questionCountMap = new Map<string, number>();
    questionCounts.forEach((count) => {
      questionCountMap.set(count.quiz_id, parseInt(count.question_count, 10));
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current: Number(current),
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results: quizzes.map((quiz) => ({
        id: quiz.quiz_id,
        author: quiz.author,
        lesson: quiz.lesson,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        time_limit: quiz.time_limit,
        passing_score: quiz.passing_score,
        max_attempts: quiz.max_attempts,
        randomize_questions: quiz.randomize_questions,
        show_results: quiz.show_results,
        show_correct_answers: quiz.show_correct_answers,
        show_explanations: quiz.show_explanations,
        status: quiz.status,
        category: quiz.category ? quiz.category.trim() : null,
        created_at: quiz.created_at,
        updated_at: quiz.updated_at,
        questions: questionCountMap.get(quiz.quiz_id) || 0, // Số câu hỏi, mặc định 0 nếu không có
      })),
    };
  }


  async getQuizById(id: string) {
    // Fetch the quiz with related data
    const quizzesQuery = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoin('users', 'user', 'user.id = quiz.author_id')
      .leftJoin(
        'difficulties',
        'difficulty',
        'difficulty.id = quiz.difficulty_id',
      )
      .leftJoin('lessons', 'lesson', 'lesson.id = quiz.lesson_id')
      .leftJoin('categories', 'category', 'category.id = quiz.category_id')
      .select([
        'quiz.id AS quiz_id',
        'user.username AS author',
        'lesson.title AS lesson',
        'quiz.lesson_id AS lesson_id',
        'quiz.title AS title',
        'quiz.description AS description',
        'difficulty.name AS difficulty',
        'difficulty.id AS difficulty_id',
        'quiz.time_limit AS time_limit',
        'quiz.passing_score AS passing_score',
        'quiz.max_attempts AS max_attempts',
        'quiz.randomize_questions AS randomize_questions',
        'quiz.show_results AS show_results',
        'quiz.show_correct_answers AS show_correct_answers',
        'quiz.show_explanations AS show_explanations',
        'quiz.status AS status',
        'category.name AS category',
        'category.id AS category_id',
        'quiz.author_id AS author_id',
        'quiz.created_at AS created_at',
        'quiz.updated_at AS updated_at',
      ])
      .where('quiz.id = :id', { id });

    const quiz = await quizzesQuery.getRawOne();

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Fetch all questions for the quiz
    const questions = await this.quizQuestionRepository
      .createQueryBuilder('question')
      .select([
        'question.id AS id',
        'question.question_type AS question_type',
        'question.question_text AS question_text',
        'question.content AS content',
        'question.explanation AS explanation',
        'question.points AS points',
        'question.question_order AS question_order',
      ])
      .where('question.quiz_id = :quizId', { quizId: id })
      .orderBy('question.question_order', 'ASC')
      .getRawMany();

    return {
      id: quiz.quiz_id,
      author: quiz.author,
      lesson: quiz.lesson,
      lesson_id: quiz.lesson_id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      difficulty_id: quiz.difficulty_id,
      time_limit: quiz.time_limit,
      passing_score: quiz.passing_score,
      max_attempts: quiz.max_attempts,
      randomize_questions: quiz.randomize_questions,
      show_results: quiz.show_results,
      show_correct_answers: quiz.show_correct_answers,
      show_explanations: quiz.show_explanations,
      status: quiz.status,
      category: quiz.category ? quiz.category.trim() : null,
      category_id: quiz.category_id,
      author_id: quiz.author_id,
      created_at: quiz.created_at,
      updated_at: quiz.updated_at,
      questions: questions.map((q) => ({
        id: q.id,
        question_type: q.question_type,
        question_text: q.question_text,
        content: q.content, // Assuming content is already JSON-parsed
        explanation: q.explanation,
        points: q.points,
        question_order: q.question_order,
      })),
    };
  }
  
  async getQuizzesPaginated(page: number = 1, pageSize: number = 6) {
    const skip = (page - 1) * pageSize;
  
    // Fetch paginated quizzes with related data
    const quizzesQuery = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoin('users', 'user', 'user.id = quiz.author_id')
      .leftJoin('difficulties', 'difficulty', 'difficulty.id = quiz.difficulty_id')
      .leftJoin('lessons', 'lesson', 'lesson.id = quiz.lesson_id')
      .leftJoin('categories', 'category', 'category.id = quiz.category_id')
      .select([
        'quiz.id AS quiz_id',
        'user.username AS author',
        'lesson.title AS lesson',
        'quiz.lesson_id AS lesson_id',
        'quiz.title AS title',
        'quiz.description AS description',
        'difficulty.name AS difficulty',
        'difficulty.id AS difficulty_id',
        'quiz.time_limit AS time_limit',
        'quiz.passing_score AS passing_score',
        'quiz.max_attempts AS max_attempts',
        'quiz.randomize_questions AS randomize_questions',
        'quiz.show_results AS show_results',
        'quiz.show_correct_answers AS show_correct_answers',
        'quiz.show_explanations AS show_explanations',
        'quiz.status AS status',
        'category.name AS category',
        'category.id AS category_id',
        'quiz.author_id AS author_id',
        'quiz.created_at AS created_at',
        'quiz.updated_at AS updated_at',
      ])
      .orderBy('quiz.created_at', 'DESC')
      .skip(skip)
      .take(pageSize);
  
    const quizzes = await quizzesQuery.getRawMany();
    const total = await this.quizRepository.count();
  
    // Optionally fetch questions for each quiz (limited or summarized)
    const quizIds = quizzes.map((quiz) => quiz.quiz_id);
    const questions = quizIds.length
      ? await this.quizQuestionRepository
          .createQueryBuilder('question')
          .select([
            'question.id AS id',
            'question.quiz_id AS quiz_id',
            'question.question_type AS question_type',
            'question.question_text AS question_text',
            'question.content AS content',
            'question.explanation AS explanation',
            'question.points AS points',
            'question.question_order AS question_order',
          ])
          .where('question.quiz_id IN (:...quizIds)', { quizIds })
          .orderBy('question.question_order', 'ASC')
          .getRawMany()
      : [];
  
    const questionsByQuizId = questions.reduce((acc, q) => {
      if (!acc[q.quiz_id]) {
        acc[q.quiz_id] = [];
      }
      acc[q.quiz_id].push({
        id: q.id,
        question_type: q.question_type,
        question_text: q.question_text,
        content: q.content, // Assuming content is JSON-parsed
        explanation: q.explanation,
        points: q.points,
        question_order: q.question_order,
      });
      return acc;
    }, {} as Record<string, any[]>);
  
    return {
      data: quizzes.map((quiz) => ({
        id: quiz.quiz_id,
        author: quiz.author,
        lesson: quiz.lesson,
        lesson_id: quiz.lesson_id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        difficulty_id: quiz.difficulty_id,
        time_limit: quiz.time_limit,
        passing_score: quiz.passing_score,
        max_attempts: quiz.max_attempts,
        randomize_questions: quiz.randomize_questions,
        show_results: quiz.show_results,
        show_correct_answers: quiz.show_correct_answers,
        show_explanations: quiz.show_explanations,
        status: quiz.status,
        category: quiz.category ? quiz.category.trim() : null,
        category_id: quiz.category_id,
        author_id: quiz.author_id,
        created_at: quiz.created_at,
        updated_at: quiz.updated_at,
        questions: questionsByQuizId[quiz.quiz_id] || [],
      })),
      meta: {
        current: page,
        pageSize,
        total,
        totalPage: Math.ceil(total / pageSize),
      },
    };
  }

  async duplicate(quizId: string, duplicateQuizDto: DuplicateQuizDto) {
    try {
      const { title } = duplicateQuizDto;

      // Find the existing quiz
      const existingQuiz = await this.quizRepository.findOne({
        where: { id: quizId },
      });

      if (!existingQuiz) {
        throw new BadRequestException('Quiz not found');
      }

      // Fetch existing questions
      const existingQuestions = await this.quizQuestionRepository.find({
        where: { quiz_id: quizId },
        order: { question_order: 'ASC' },
      });

      // Create new quiz
      const newQuiz = this.quizRepository.create({
        lesson_id: existingQuiz.lesson_id,
        title: title || `${existingQuiz.title} (Copy)`,
        author_id: existingQuiz.author_id,
        description: existingQuiz.description,
        category_id: existingQuiz.category_id,
        difficulty_id: existingQuiz.difficulty_id,
        time_limit: existingQuiz.time_limit,
        passing_score: existingQuiz.passing_score,
        max_attempts: existingQuiz.max_attempts,
        randomize_questions: existingQuiz.randomize_questions,
        show_results: existingQuiz.show_results,
        show_correct_answers: existingQuiz.show_correct_answers,
        show_explanations: existingQuiz.show_explanations,
        status: existingQuiz.status, // Or set to 'draft' if preferred
      });

      // Save the new quiz
      const savedQuiz = await this.quizRepository.save(newQuiz);

      // Duplicate questions if any
      if (existingQuestions.length > 0) {
        const newQuestions = existingQuestions.map((question) =>
          this.quizQuestionRepository.create({
            quiz_id: savedQuiz.id,
            question_text: question.question_text,
            question_type: question.question_type,
            content: JSON.parse(JSON.stringify(question.content)), // Deep copy
            explanation: question.explanation,
            points: question.points,
            question_order: question.question_order,
            // created_at and updated_at are set by database defaults
          }),
        );

        await this.quizQuestionRepository.save(newQuestions);
      }

      // Return the new quiz with its questions
      const result = await this.quizRepository.findOne({
        where: { id: savedQuiz.id },
      });
      const questions = await this.quizQuestionRepository.find({
        where: { quiz_id: savedQuiz.id },
        order: { question_order: 'ASC' },
      });

      return {
        ...result,
        questions,
      };
    } catch (error) {
      throw new Error(`Failed to duplicate quiz: ${error.message}`);
    }
  }

  // Lấy danh sách câu hỏi của quiz
  // async getQuizQuestions(dto: GetQuizQuestionsDto): Promise<ResponseQuestionDto[]> {
  //   const quiz = await this.quizRepository.findOne({
  //     where: { id: dto.quiz_id, status: 'published' },
  //   });
  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found or not published');
  //   }

  //   let questions = await this.quizQuestionRepository.find({
  //     where: { quiz_id: dto.quiz_id },
  //   });

  //   if (quiz.randomize_questions) {
  //     questions = this.shuffleArray(questions);
  //   }

  //   // return questions.map((q) => ({
  //   //   ...q,
  //   //   question_text: q.question_text.replace(/\[\[.*?\]\]/g, '[]'),
  //   //   explanation: "",
  //   //   content: this.stripCorrectAnswers(q.content, q.question_type),
  //   // }));
  //   return questions.map((q) => ({
  //     id: q.id,
  //     question_text: q.question_text.replace(/\[\[.*?\]\]/g, '[[]]'),
  //     question_type: q.question_type,
  //     content: this.stripCorrectAnswers(q.content, q.question_type),
  //     points: q.points,
  //     question_order: q.question_order,
  //   }))
  // }

  async getQuizQuestions(dto: GetQuizQuestionsDto): Promise<ResponseQuizDto> {
    const quiz = await this.quizRepository.findOne({
      where: { id: dto.quiz_id, status: 'published' },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found or not published');
    }

    let questions = await this.quizQuestionRepository.find({
      where: { quiz_id: dto.quiz_id },
    });

    if (quiz.randomize_questions) {
      questions = this.shuffleArray(questions);
    }

    console.log('questions', questions);


    const formatQuestion =  questions.map((q) => ({
      id: q.id,
      question_text: q.question_text.replace(/\[\[.*?\]\]/g, '[[]]'),
      question_type: q.question_type as QuestionType,
      content: this.stripCorrectAnswers(q.content, q.question_type),
      points: q.points,
      question_order: q.question_order,
    }))

    return {
      time_limit: quiz.time_limit,
      passing_score: quiz.passing_score,
      title: quiz.title,
      content: formatQuestion,
    }
  }

  // async getQuizAndQuestions(quizId: string, userId: string): Promise<ResponseQuizAttemptDto> {
  //   if (!userId) {
  //     throw new BadRequestException('User ID is required');
  //   }

  //   const quiz = await this.quizRepository.findOne({
  //     where: { id: quizId, status: 'published' },
  //   });
  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found or not published');
  //   } 

  //   let quizQuestions = await this.quizQuestionRepository.find({
  //     where: { quiz_id: quizId },
  //   });

  //   if (quiz.randomize_questions) {
  //     quizQuestions = this.shuffleArray(quizQuestions);
  //   }

  //   // Save question snapshots
  //   // const questionSnapshots = quizQuestions.map(q => ({
  //   //   quiz_id: quizId,
  //   //   question_id: q.id,
  //   //   content: q.question_text,
  //   //   options: q.content,
  //   //   correct_answer: q.content,
  //   //   question_type: q.question_type,
  //   //   points: q.points,
  //   //   question_order: q.question_order,
  //   // }));
  //   // await this.questionSnapshotsService.createMany(questionSnapshots);

  //   // Lấy thông tin bài quiz
  //   const quizDto: QuizInfoDto = {
  //     id: quiz.id,
  //     title: quiz.title,
  //     description: quiz.description,
  //     time_limit: quiz.time_limit,
  //     passing_score: quiz.passing_score,
  //     max_attempts: quiz.max_attempts,
  //     randomize_questions: quiz.randomize_questions,
  //     show_results: quiz.show_results,
  //     show_correct_answers: quiz.show_correct_answers,
  //     total_questions: quizQuestions.length,
  //     total_points: quizQuestions.reduce((acc, q) => acc + q.points, 0),
  //   }

  //   // Save quiz attempt
  //   const attempt_save = await this.quizAttemptRepository.create({
  //     quiz_id: quiz.id,
  //     user_id: userId,
  //     status: 'in_progress',
  //     started_at: new Date(),
  //   });
  //   const savedAttempt = await this.quizAttemptRepository.save(attempt_save);

  //   // Lấy tthông tin attempt
  //   const attemptDto: QuizAttemptDto = {
  //     attempt_id: savedAttempt.id,
  //     started_at: savedAttempt.started_at.toISOString(),
  //   }

  //   // Lấy thông tin câu hỏi
  //   const formattedQuestions: QuizQuestionDto[] = quizQuestions.map((q) => ({
  //     id: q.id,
  //     question_text: q.question_text.replace(/\[\[.*?\]\]/g, '[[]]'),
  //     question_type: q.question_type as QuestionType,
  //     content: this.stripCorrectAnswers(q.content, q.question_type),
  //     points: q.points,
  //     question_order: q.question_order,
  //   }));
    
  //   return {
  //     quiz: quizDto,
  //     attempt: attemptDto,
  //     questions: formattedQuestions,
  //   };
  // }

  // async getQuizAndQuestions(quizId: string, userId: string): Promise<ResponseQuizAttemptDto> {
  //   if (!userId) {
  //     throw new BadRequestException('User ID is required');
  //   }
  
  //   const quiz = await this.quizRepository.findOne({
  //     where: { id: quizId, status: 'published' },
  //   });
  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found or not published');
  //   }
  
  //   let quizQuestions = await this.quizQuestionRepository.find({
  //     where: { quiz_id: quizId },
  //   }) as unknown as QuizQuestion[];
  
  //   if (quiz.randomize_questions) {
  //     quizQuestions = this.shuffleArray(quizQuestions);
  //   }
  
  //   // Prepare question snapshots
  //   const questionSnapshots = quizQuestions.map((q) => {
  //     let correct_answer: any;
  
  //     switch (q.question_type) {
  //       case 'single-choice':
  //         if ('options' in q.content) {
  //           correct_answer = q.content.options
  //             .filter((opt) => opt.is_correct)
  //             .map((opt) => opt.id);
  //           correct_answer = correct_answer.length > 0 ? correct_answer[0] : null;
  //         } else {
  //           throw new Error('Invalid content structure for single-choice question');
  //         }
  //         break;
  
  //       case 'multiple-choice':
  //         if ('options' in q.content) {
  //           correct_answer = q.content.options
  //             .filter((opt) => opt.is_correct)
  //             .map((opt) => opt.id);
  //         } else {
  //           throw new Error('Invalid content structure for multiple-choice question');
  //         }
  //         break;
  
  //       case 'true-false':
  //         if ('correct_answer' in q.content) {
  //           correct_answer = q.content.correct_answer;
  //         } else {
  //           throw new Error('Invalid content structure for true-false question');
  //         }
  //         break;
  
  //       case 'matching':
  //         if ('correct_matches' in q.content) {
  //           correct_answer = q.content.correct_matches.reduce((acc: any, match) => {
  //             acc[match.item_id] = match.match_id;
  //             return acc;
  //           }, {});
  //         } else {
  //           throw new Error('Invalid content structure for matching question');
  //         }
  //         break;
  
  //       case 'image-matching':
  //         if ('correct_image_matches' in q.content) {
  //           correct_answer = q.content.correct_image_matches.reduce((acc: any, match) => {
  //             acc[match.url_id] = match.label_id;
  //             return acc;
  //           }, {});
  //         } else {
  //           throw new Error('Invalid content structure for image-matching question');
  //         }
  //         break;
  
  //       case 'fill-blanks':
  //         if ('correct_answers' in q.content) {
  //           correct_answer = q.content.correct_answers;
  //         } else {
  //           throw new Error('Invalid content structure for fill-blanks question');
  //         }
  //         break;
  
  //       default:
  //         throw new Error(`Unsupported question type: ${q.question_type}`);
  //     }
  
  //     return {
  //       quiz_id: quizId,
  //       question_id: q.id,
  //       content: q.question_text,
  //       options: q.content, // Store entire content as options
  //       correct_answer, // Store derived correct answer
  //       question_type: q.question_type,
  //       points: q.points,
  //       question_order: q.question_order,
  //     };
  //   });
  
  //   // Save question snapshots
  //   const snapshots = questionSnapshots.map(dto => {
  //     const entity = new QuestionSnapshotEntity();
  //     entity.quiz_id = dto.quiz_id;
  //     entity.question_id = dto.question_id;
  //     entity.content = dto.content;
  //     entity.options = JSON.stringify(dto.options) as unknown as JSON;
  //     entity.correct_answer = JSON.stringify(dto.correct_answer) as unknown as JSON;
  //     entity.question_type = dto.question_type;
  //     entity.points = dto.points;
  //     entity.question_order = dto.question_order;
  //     return entity;
  //   });
  //   await this.questionSnapshotRepository.save(snapshots);

  //   // Quiz info
  //   const quizDto: QuizInfoDto = {
  //     id: quiz.id,
  //     title: quiz.title,
  //     description: quiz.description,
  //     time_limit: quiz.time_limit,
  //     passing_score: quiz.passing_score,
  //     max_attempts: quiz.max_attempts,
  //     randomize_questions: quiz.randomize_questions,
  //     show_results: quiz.show_results,
  //     show_correct_answers: quiz.show_correct_answers,
  //     total_questions: quizQuestions.length,
  //     total_points: quizQuestions.reduce((acc, q) => acc + q.points, 0),
  //   };
  
  //   // Save quiz attempt
  //   const attempt_save = await this.quizAttemptRepository.create({
  //     quiz_id: quiz.id,
  //     user_id: userId,
  //     status: 'in_progress',
  //     started_at: new Date(),
  //   });
  //   const savedAttempt = await this.quizAttemptRepository.save(attempt_save);
  
  //   // Attempt info
  //   const attemptDto: QuizAttemptDto = {
  //     attempt_id: savedAttempt.id,
  //     started_at: savedAttempt.started_at.toISOString(),
  //   };
  
  //   // Format questions for response
  //   const formattedQuestions: QuizQuestionDto[] = quizQuestions.map((q) => ({
  //     id: q.id,
  //     question_text: q.question_text.replace(/\[\[.*?\]\]/g, '[[]]'),
  //     question_type: q.question_type as QuestionType,
  //     content: this.stripCorrectAnswers(q.content, q.question_type),
  //     points: q.points,
  //     question_order: q.question_order,
  //   }));
  
  //   return {
  //     quiz: quizDto,
  //     attempt: attemptDto,
  //     questions: formattedQuestions,
  //   };
  // }

  async getQuizAndQuestions(quizId: string, userId: string): Promise<ResponseQuizAttemptDto> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, status: 'published' },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found or not published');
    }
  
    let quizQuestions: QuizQuestion[] = await this.quizQuestionRepository.find({
      where: { quiz_id: quizId },
    }).then(questions => questions.map(q => ({
      ...q,
      question_type: q.question_type as QuestionType
    })));
  
    if (quiz.randomize_questions) {
      quizQuestions = this.shuffleArray(quizQuestions);
    }
  
  
    // Quiz info
    const quizDto: QuizInfoDto = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.time_limit,
      passing_score: quiz.passing_score,
      max_attempts: quiz.max_attempts,
      randomize_questions: quiz.randomize_questions,
      show_results: quiz.show_results,
      show_correct_answers: quiz.show_correct_answers,
      total_questions: quizQuestions.length,
      total_points: quizQuestions.reduce((acc, q) => acc + q.points, 0),
    };
  
    // Save quiz attempt
    const attempt_save = await this.quizAttemptRepository.create({
      quiz_id: quiz.id,
      user_id: userId,
      status: 'in_progress',
      started_at: new Date(),
    });
    const savedAttempt = await this.quizAttemptRepository.save(attempt_save);
  
    // Attempt info
    const attemptDto: QuizAttemptDto = {
      attempt_id: savedAttempt.id,
      started_at: savedAttempt.started_at.toISOString(),
    };

    // Prepare question snapshots
    const questionSnapshots = quizQuestions.map((q) => {
      let correct_answer: any;
  
      switch (q.question_type) {
        case 'single-choice':
          if ('options' in q.content) {
            const correctOptions = q.content.options
              .filter((opt) => opt.is_correct)
              .map((opt) => opt.id);
            correct_answer = correctOptions.length > 0 ? correctOptions[0] : null;
          } else {
            throw new Error('Invalid content structure for single-choice question');
          }
          break;
  
        case 'multiple-choice':
          if ('options' in q.content) {
            correct_answer = q.content.options
              .filter((opt) => opt.is_correct)
              .map((opt) => opt.id);
          } else {
            throw new Error('Invalid content structure for multiple-choice question');
          }
          break;
  
        case 'true-false':
          if ('correct_answer' in q.content) {
            correct_answer = q.content.correct_answer;
          } else {
            throw new Error('Invalid content structure for true-false question');
          }
          break;
  
        case 'matching':
          if ('correct_matches' in q.content) {
            correct_answer = q.content.correct_matches.reduce((acc: any, match) => {
              console.log('>>>match: ', match);
              console.log('>>>acc: ', acc);
              acc[match.item_id] = match.match_id;
              return acc;
            }, {});
          } else {
            throw new Error('Invalid content structure for matching question');
          }
          break;
  
        case 'image-matching':
          console.log('>>correct_image_matches: ', q.content);
          if ('correct_image_matches' in q.content) {
            correct_answer = q.content.correct_image_matches.reduce((acc: any, match) => {
              acc[match.url_id] = match.label_id;
              return acc;
            }, {});
          } else {
            throw new Error('Invalid content structure for image-matching question');
          }
          break;
  
        case 'fill-blanks':
          if ('correct_answers' in q.content) {
            correct_answer = q.content.correct_answers;
          } else {
            throw new Error('Invalid content structure for fill-blanks question');
          }
          break;
  
        default:
          throw new Error(`Unsupported question type: ${q.question_type}`);
      }
  
      return {
        quiz_id: quizId,
        question_id: q.id,
        content: q.question_text,
        options: q.content, // Store entire content as options
        correct_answer, // Store derived correct answer
        question_type: q.question_type,
        points: q.points,
        question_order: q.question_order,
      };
    });

    console.log('>>>questionSnapshots: ', questionSnapshots);
  
    // Save question snapshots
    const snapshots = questionSnapshots.map(dto => {
      const entity = new QuestionSnapshotEntity();
      entity.quiz_id = dto.quiz_id;
      entity.attempt_id = savedAttempt.id; // Add attempt_id when saving snapshots
      entity.question_id = dto.question_id;
      entity.content = dto.content;
      entity.options = JSON.parse(JSON.stringify(dto.options)) as unknown as JSON;
      entity.correct_answer = JSON.parse(JSON.stringify(dto.correct_answer)) as unknown as JSON;
      entity.question_type = dto.question_type;
      entity.points = dto.points;
      entity.question_order = dto.question_order;
      return entity;
    });
    await this.questionSnapshotRepository.save(snapshots);
  
    // Format questions for response
    const formattedQuestions: QuizQuestionDto[] = quizQuestions.map((q) => ({
      id: q.id,
      question_text: q.question_text.replace(/\[\[.*?\]\]/g, '[[]]'),
      question_type: q.question_type as QuestionType,
      content: this.stripCorrectAnswers(q.content, q.question_type),
      points: q.points,
      question_order: q.question_order,
    }));
  
    return {
      quiz: quizDto,
      attempt: attemptDto,
      questions: formattedQuestions,
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  stripCorrectAnswers(content: QuizQuestionContent, question_type: string): any {
    const strippedContent = { ...content };
    switch (question_type) {
      case 'single-choice':
      case 'multiple-choice':
        if ('options' in strippedContent) {
          strippedContent.options = strippedContent.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            is_correct: false // Set to false to hide correct answers
          }));
        }
        break;
      case 'true-false':
        if ('correct_answer' in strippedContent) {
          delete strippedContent.correct_answer;
        }
        break;
      case 'matching':
        if ('correct_matches' in strippedContent) {
          delete strippedContent.correct_matches;
        }
        break;
      case 'image-matching':
        if ('correct_image_matches' in strippedContent) {
          delete strippedContent.correct_image_matches;
        }
        break;
      case 'fill-blanks':
        if ('correct_answers' in strippedContent) {
          delete strippedContent.correct_answers;
        }
        break;
    }
    return strippedContent;
  }

  async getQuizOverview(quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, status: 'published' },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found or not published');
    }

    const totalQuestions = await this.quizQuestionRepository.count({
      where: { quiz_id: quizId },
    });

    const time_limit = quiz.time_limit;
    const passing_score = quiz.passing_score;
    const title = quiz.title;

    return {
      total_questions: totalQuestions,
      time_limit: time_limit,
      passing_score: passing_score,
      title: title,
    }
  }

  // async submitQuizAttempt(
  //   answers: {
  //     attempt_id: string;
  //     quiz_id: string;
  //     answers: Array<{
  //       question_id: string;
  //       question_type: string;
  //       answer: any;
  //     }>;
  //   }
  // ) {
  //   try {
  //     // 1. Get the quiz attempt
  //     const attempt = await this.quizAttemptRepository.findOne({
  //       where: {
  //         id: answers.attempt_id,
  //         quiz_id: answers.quiz_id
  //       },
  //       select: ['id', 'quiz_id', 'user_id', 'score', 'status', 'started_at', 'completed_at', 'is_passed']
  //     });

  //     console.log('>>>attemptId: ', answers.attempt_id);
  //     console.log('>>>quizId: ', answers.quiz_id);
  //     console.log('>>>answers: ', answers);
  //     console.log('>>>attempt: ', attempt);
      
  //     const queryBuilder = this.quizAttemptRepository.createQueryBuilder('attempt')
  //       .where('attempt.id = :id', { id: answers.attempt_id })
  //       .andWhere('attempt.quiz_id = :quizId', { quizId: answers.quiz_id });
      
  //     console.log('>>>SQL Query:', queryBuilder.getSql());
  //     console.log('>>>Parameters:', queryBuilder.getParameters());

  //     if (!attempt) {
  //       throw new NotFoundException('Quiz attempt not found');
  //     }

  //     if (attempt.status === 'completed') {
  //       throw new BadRequestException('This quiz attempt has already been submitted');
  //     }

  //     // 2. Get question snapshots for this quiz attempt
  //     const questionSnapshots = await this.questionSnapshotRepository.find({
  //       where: { 
  //         quiz_id: answers.quiz_id,
  //         attempt_id: answers.attempt_id 
  //       },
  //       order: { question_order: 'ASC' }
  //     });

  //     if (!questionSnapshots.length) {
  //       throw new NotFoundException('No question snapshots found for this attempt');
  //     }

  //     // 3. Calculate score and prepare attempt answers
  //     let totalScore = 0;
  //     const attemptAnswers = [];

  //     for (const answer of answers.answers) {
  //       const snapshot = questionSnapshots.find(s => s.question_id === answer.question_id);
  //       if (!snapshot) continue;

  //       let isCorrect = false;
  //       const correctAnswer = typeof snapshot.correct_answer === 'string' 
  //         ? JSON.parse(snapshot.correct_answer)
  //         : snapshot.correct_answer;

  //       // Convert both answers to the same type before comparison
  //       const normalizedUserAnswer = this.normalizeAnswer(answer.answer, answer.question_type);
  //       const normalizedCorrectAnswer = this.normalizeAnswer(correctAnswer, answer.question_type);

  //       switch (answer.question_type) {
  //         case 'single-choice':
  //           isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
  //           break;

  //         case 'multiple-choice':
  //           // Sort arrays to ensure order doesn't matter
  //           const sortedUserAnswer = [...normalizedUserAnswer].sort();
  //           const sortedCorrectAnswer = [...normalizedCorrectAnswer].sort();
  //           isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
  //           break;

  //         case 'true-false':
  //           isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
  //           break;

  //         case 'matching':
  //           // Compare each key-value pair
  //           const userMatches = normalizedUserAnswer;
  //           const correctMatches = normalizedCorrectAnswer;
  //           isCorrect = Object.keys(userMatches).every(key => 
  //             userMatches[key] === correctMatches[key]
  //           );
  //           break;

  //         case 'image-matching':
  //           // Similar to matching
  //           const userImageMatches = normalizedUserAnswer;
  //           const correctImageMatches = normalizedCorrectAnswer;
  //           isCorrect = Object.keys(userImageMatches).every(key => 
  //             userImageMatches[key] === correctImageMatches[key]
  //           );
  //           break;

  //         case 'fill-blanks':
  //           // Compare arrays
  //           const sortedUserFillAnswers = [...normalizedUserAnswer].sort();
  //           const sortedCorrectFillAnswers = [...normalizedCorrectAnswer].sort();
  //           isCorrect = JSON.stringify(sortedUserFillAnswers) === JSON.stringify(sortedCorrectFillAnswers);
  //           break;
  //       }

  //       console.log('>>>answer: ', answer);
  //       console.log('>>>correct answer: ', correctAnswer);
  //       console.log('>>>isCorrect: ', isCorrect);
  //       // Add score if correct
  //       if (isCorrect) {
  //         totalScore += snapshot.points;
  //       }

  //       // Prepare attempt answer record
  //       attemptAnswers.push({
  //         attempt_id: answers.attempt_id,
  //         snapshot_id: snapshot.id,
  //         user_answer: JSON.stringify(answer.answer),
  //         is_correct: isCorrect,
  //       });
  //     }

  //     // 4. Calculate percentage score
  //     const totalPossiblePoints = questionSnapshots.reduce((sum, q) => sum + q.points, 0);
  //     const percentageScore = (totalScore / totalPossiblePoints) * 100;

  //     // 5. Update quiz attempt
  //     const quiz = await this.quizRepository.findOne({ where: { id: answers.quiz_id } });
  //     const isPassed = percentageScore >= quiz.passing_score;

  //     await this.quizAttemptRepository.update(answers.attempt_id, {
  //       status: 'completed',
  //       score: totalScore,
  //       is_passed: isPassed,
  //       completed_at: new Date(),
  //     });

  //     // 6. Save attempt answers
  //     await this.attemptAnswerRepository.save(attemptAnswers);

  //     // Prepare results with correct answers
  //     const results = questionSnapshots.map(snapshot => {
  //       const correctAnswer = typeof snapshot.correct_answer === 'string' 
  //         ? JSON.parse(snapshot.correct_answer)
  //         : snapshot.correct_answer;

  //       let correctAnswers;
  //       switch (snapshot.question_type) {
  //         case 'single-choice':
  //           correctAnswers = String(correctAnswer);
  //           break;
  //         case 'multiple-choice':
  //           correctAnswers = correctAnswer;
  //           break;
  //         case 'true-false':
  //           correctAnswers = correctAnswer;
  //           break;
  //         case 'matching':
  //         case 'image-matching':
  //           correctAnswers = Object.entries(correctAnswer).map(([key, value]) => ({
  //             key,
  //             value
  //           }));
  //           break;
  //         case 'fill-blanks':
  //           correctAnswers = correctAnswer;
  //           break;
  //         default:
  //           correctAnswers = correctAnswer;
  //       }

  //       return {
  //         question_id: snapshot.question_id,
  //         correctAnswers
  //       };
  //     });

  //     return {
  //       statusCode: 200,
  //       message: 'Quiz attempt submitted successfully',
  //       data: {
  //         attempt_id: answers.attempt_id,
  //         total_score: totalScore,
  //         percentage_score: percentageScore,
  //         is_passed: isPassed,
  //         total_questions: questionSnapshots.length,
  //         correct_answers: attemptAnswers.filter(a => a.is_correct).length,
  //         results
  //       }
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to submit quiz attempt: ${error.message}`);
  //   }
  // }

  async submitQuizAttempt(
    answers: {
      attempt_id: string;
      quiz_id: string;
      answers: Array<{
        question_id: string;
        question_type: string;
        answer: any;
      }>;
    }
  ) {
    try {
      // 1. Get the quiz attempt
      const attempt = await this.quizAttemptRepository.findOne({
        where: {
          id: answers.attempt_id,
          quiz_id: answers.quiz_id
        },
        select: ['id', 'quiz_id', 'user_id', 'score', 'status', 'started_at', 'completed_at', 'is_passed']
      });

      console.log('>>>attemptId: ', answers.attempt_id);
      console.log('>>>quizId: ', answers.quiz_id);
      console.log('>>>answers: ', answers);
      console.log('>>>attempt: ', attempt);
      
      const queryBuilder = this.quizAttemptRepository.createQueryBuilder('attempt')
        .where('attempt.id = :id', { id: answers.attempt_id })
        .andWhere('attempt.quiz_id = :quizId', { quizId: answers.quiz_id });
      
      console.log('>>>SQL Query:', queryBuilder.getSql());
      console.log('>>>Parameters:', queryBuilder.getParameters());

      if (!attempt) {
        throw new NotFoundException('Quiz attempt not found');
      }

      if (attempt.status === 'completed') {
        throw new BadRequestException('This quiz attempt has already been submitted');
      }

      // 2. Get question snapshots for this quiz attempt
      const questionSnapshots = await this.questionSnapshotRepository.find({
        where: { 
          quiz_id: answers.quiz_id,
          attempt_id: answers.attempt_id 
        },
        order: { question_order: 'ASC' }
      });

      if (!questionSnapshots.length) {
        throw new NotFoundException('No question snapshots found for this attempt');
      }

      // 3. Calculate score and prepare attempt answers
      let totalScore = 0;
      const attemptAnswers = [];

      for (const answer of answers.answers) {
        const snapshot = questionSnapshots.find(s => s.question_id === answer.question_id);
        if (!snapshot) continue;

        let isCorrect = false;
        const correctAnswer = typeof snapshot.correct_answer === 'string' 
          ? JSON.parse(snapshot.correct_answer)
          : snapshot.correct_answer;

        // Convert both answers to the same type before comparison
        const normalizedUserAnswer = this.normalizeAnswer(answer.answer, answer.question_type);
        const normalizedCorrectAnswer = this.normalizeAnswer(correctAnswer, answer.question_type);

        switch (answer.question_type) {
          case 'single-choice':
            isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
            break;

          case 'multiple-choice':
            // Sort arrays to ensure order doesn't matter
            const sortedUserAnswer = [...normalizedUserAnswer].sort();
            const sortedCorrectAnswer = [...normalizedCorrectAnswer].sort();
            isCorrect = JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
            break;

          case 'true-false':
            isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
            break;

          case 'matching':
            // Convert array of key-value pairs to object
            const userAnswerMap = answer.answer.reduce((acc, pair) => {
              acc[pair.key] = pair.value;
              return acc;
            }, {});
            
            // Compare each key-value pair
            isCorrect = Object.keys(userAnswerMap).every(key => 
              userAnswerMap[key] === normalizedCorrectAnswer[key]
            );
            break;

          case 'image-matching':
            // Convert array of key-value pairs to object
            const userAnswerMapImageMatching = {};
            answer.answer.forEach(pair => {
              userAnswerMapImageMatching[pair.key] = pair.value;
            });
            
            // Compare each key-value pair
            const correctImageAnswer = normalizedCorrectAnswer;
            
            // Check if all keys exist and values match
            const imageKeysMatch = Object.keys(correctImageAnswer).every(key => 
              userAnswerMapImageMatching[key] === correctImageAnswer[key]
            );
            
            // Check if there are no extra or missing pairs
            const imagePairsMatch = Object.keys(userAnswerMapImageMatching).length === Object.keys(correctImageAnswer).length;
            
            isCorrect = imageKeysMatch && imagePairsMatch;
            break;

          case 'fill-blanks':
            // Compare arrays
            const sortedUserFillAnswers = [...normalizedUserAnswer].sort();
            const sortedCorrectFillAnswers = [...normalizedCorrectAnswer].sort();
            isCorrect = JSON.stringify(sortedUserFillAnswers) === JSON.stringify(sortedCorrectFillAnswers);
            break;
        }

        console.log('>>>answer: ', answer);
        console.log('>>>correct answer: ', correctAnswer);
        console.log('>>>isCorrect: ', isCorrect);
        // Add score if correct
        if (isCorrect) {
          totalScore += snapshot.points;
        }

        // Prepare attempt answer record
        attemptAnswers.push({
          attempt_id: answers.attempt_id,
          snapshot_id: snapshot.id,
          user_answer: typeof answer.answer === 'string' ? answer.answer : JSON.stringify(answer.answer),
          is_correct: isCorrect,
        });
      }

      // 4. Calculate percentage score
      const totalPossiblePoints = questionSnapshots.reduce((sum, q) => sum + q.points, 0);
      const percentageScore = (totalScore / totalPossiblePoints) * 100;

      // 5. Update quiz attempt
      const quiz = await this.quizRepository.findOne({ where: { id: answers.quiz_id } });
      const isPassed = percentageScore >= quiz.passing_score;

      await this.quizAttemptRepository.update(answers.attempt_id, {
        status: 'completed',
        score: totalScore,
        is_passed: isPassed,
        completed_at: new Date(),
      });

      // 6. Save attempt answers
      await this.attemptAnswerRepository.save(attemptAnswers);

      // Prepare results with correct answers
      const results = questionSnapshots.map(snapshot => {
        const correctAnswer = typeof snapshot.correct_answer === 'string' 
          ? JSON.parse(snapshot.correct_answer)
          : snapshot.correct_answer;

        let correctAnswers;
        switch (snapshot.question_type) {
          case 'single-choice':
            correctAnswers = String(correctAnswer);
            break;
          case 'multiple-choice':
            correctAnswers = correctAnswer;
            break;
          case 'true-false':
            correctAnswers = correctAnswer;
            break;
          case 'matching':
          case 'image-matching':
            correctAnswers = Object.entries(correctAnswer).map(([key, value]) => ({
              key,
              value
            }));
            break;
          case 'fill-blanks':
            correctAnswers = correctAnswer;
            break;
          default:
            correctAnswers = correctAnswer;
        }

        return {
          question_id: snapshot.question_id,
          correctAnswers
        };
      });

      return {
        statusCode: 200,
        message: 'Quiz attempt submitted successfully',
        data: {
          attempt_id: answers.attempt_id,
          total_score: totalScore,
          percentage_score: percentageScore,
          is_passed: isPassed,
          total_questions: questionSnapshots.length,
          correct_answers: attemptAnswers.filter(a => a.is_correct).length,
          results
        }
      };
    } catch (error) {
      throw new Error(`Failed to submit quiz attempt: ${error.message}`);
    }
  }

  private normalizeAnswer(answer: any, questionType: string): any {
    switch (questionType) {
      case 'single-choice':
        // Convert to string for consistent comparison
        return String(answer);
      
      case 'multiple-choice':
        // Ensure array of strings
        return Array.isArray(answer) ? answer.map(String) : [String(answer)];
      
      case 'true-false':
        // Convert to boolean
        return Boolean(answer);
      
      case 'matching':
      case 'image-matching':
        // Ensure all values are strings
        if (typeof answer === 'object' && answer !== null) {
          const normalized = {};
          Object.keys(answer).forEach(key => {
            normalized[key] = String(answer[key]);
          });
          return normalized;
        }
        return answer;
      
      case 'fill-blanks':
        // Ensure array of strings
        return Array.isArray(answer) ? answer.map(String) : [String(answer)];
      
      default:
        return answer;
    }
  }

  private getCorrectAnswer(content: any, questionType: string): any {
    switch (questionType) {
      case 'single-choice':
        if ('options' in content) {
          const correctOption = content.options.find(opt => opt.is_correct);
          return correctOption ? correctOption.id : null;
        }
        break;

      case 'multiple-choice':
        if ('options' in content) {
          return content.options
            .filter(opt => opt.is_correct)
            .map(opt => opt.id);
        }
        break;

      case 'true-false':
        if ('correct_answer' in content) {
          return content.correct_answer;
        }
        break;

      case 'matching':
        if ('correct_matches' in content) {
          return content.correct_matches.reduce((acc, match) => {
            acc[match.item_id] = match.match_id;
            return acc;
          }, {});
        }
        break;

      case 'image-matching':
        if ('correct_image_matches' in content) {
          return content.correct_image_matches.reduce((acc, match) => {
            acc[match.url_id] = match.label_id;
            return acc;
          }, {});
        }
        break;

      case 'fill-blanks':
        if ('correct_answers' in content) {
          return content.correct_answers;
        }
        break;
    }
    return null;
  }
}
