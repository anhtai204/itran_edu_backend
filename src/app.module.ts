import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/users/entities/users.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth-guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { UserProfilesModule } from './modules/user_profiles/user_profiles.module';
import { AuthSessionsModule } from './modules/auth_sessions/auth_sessions.module';
import { OauthConnectionsModule } from './modules/oauth_connections/oauth_connections.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CourseChaptersModule } from './modules/course_chapters/course_chapters.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { CourseEnrollmentsModule } from './modules/course_enrollments/course_enrollments.module';
import { MessageThreadsModule } from './modules/message_threads/message_threads.module';
import { MessagesModule } from './modules/messages/messages.module';
import { DiscussionsModule } from './modules/discussions/discussions.module';
import { DiscussionRepliesModule } from './modules/discussion_replies/discussion_replies.module';
import { SupportTicketsModule } from './modules/support_tickets/support_tickets.module';
import { TicketResponsesModule } from './modules/ticket_responses/ticket_responses.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { SystemSettingsModule } from './modules/system_settings/system_settings.module';
import { ActivityLogsModule } from './modules/activity_logs/activity_logs.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MediaFilesModule } from './modules/media_files/media_files.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolePermissionsModule } from './modules/role_permissions/role_permissions.module';
import { ActivityLogEntity } from './modules/activity_logs/entities/activity_log.entity';
import { AuthSessionEntity } from './modules/auth_sessions/entities/auth_session.entity';
import { CourseChapterEntity } from './modules/course_chapters/entities/course_chapter.entity';
import { CourseEnrollmentEntity } from './modules/course_enrollments/entities/course_enrollment.entity';
import { CourseEntity } from './modules/courses/entities/course.entity';
import { DiscussionReplyEntity } from './modules/discussion_replies/entities/discussion_reply.entity';
import { DiscussionEntity } from './modules/discussions/entities/discussion.entity';
import { FaqEntity } from './modules/faqs/entities/faq.entity';
import { LessonEntity } from './modules/lessons/entities/lesson.entity';
import { MediaFileEntity } from './modules/media_files/entities/media_file.entity';
import { MessageThreadEntity } from './modules/message_threads/entities/message_thread.entity';
import { MessageEntity } from './modules/messages/entities/message.entity';
import { NotificationEntity } from './modules/notifications/entities/notification.entity';
import { OauthConnectionEntity } from './modules/oauth_connections/entities/oauth_connection.entity';
import { PermissionEntity } from './modules/permissions/entities/permission.entity';
import { QuizEntity } from './modules/quizzes/entities/quiz.entity';
import { RolePermissionEntity } from './modules/role_permissions/entities/role_permission.entity';
import { RoleEntity } from './modules/roles/entities/role.entity';
import { SupportTicketEntity } from './modules/support_tickets/entities/support_ticket.entity';
import { SystemSettingEntity } from './modules/system_settings/entities/system_setting.entity';
import { TicketResponseEntity } from './modules/ticket_responses/entities/ticket_response.entity';
import { UserProfileEntity } from './modules/user_profiles/entities/user_profile.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { CategoryEntity } from './modules/categories/entities/category.entity';
import { PostsModule } from './modules/posts/posts.module';
import { PostEntity } from './modules/posts/entities/post.entity';
import { PostTagsModule } from './modules/post_tags/post_tags.module';
import { PostTagsEntity } from './modules/post_tags/entities/post_tag.entity';
import { UploadModule } from './modules/upload/upload.module';
import { PostCommentsModule } from './modules/post_comments/post_comments.module';
import { PostCommentEntity } from './modules/post_comments/entities/post_comment.entity';
import { PostCommentsLikesModule } from './modules/post_comments_likes/post_comments_likes.module';
import { PostCommentLikeEntity } from './modules/post_comments_likes/entities/post_comments_like.entity';
import { PostLikesModule } from './modules/post_likes/post_likes.module';
import { PostLikeEntity } from './modules/post_likes/entities/post_like.entity';
import { NewsModule } from './modules/news/news.module';
import { NewsEntity } from './modules/news/entities/news.entity';
import { NewsTagsEntity } from './modules/news_tags/entities/news_tag.entity';
import { NewsTagsModule } from './modules/news_tags/news_tags.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { QuizAnswerEntity } from './modules/quiz_answers/entities/quiz_answer.entity';
import { QuizAttemptEntity } from './modules/quiz_attempts/entities/quiz_attempt.entity';
import { QuizQuestionEntity } from './modules/quiz_questions/entities/quiz_question.entity';
import { DifficultiesModule } from './modules/difficulties/difficulties.module';
import { DifficultyEntity } from './modules/difficulties/entities/difficulty.entity';
import { QuizQuestionsModule } from './modules/quiz_questions/quiz_questions.module';
import { QuizAttemptsModule } from './modules/quiz_attempts/quiz_attempts.module';
import { CategoryQuizModule } from './modules/category_quiz/category_quiz.module';
import { CategoryQuizEntity } from './modules/category_quiz/entities/category_quiz.entity';
import { QuestionSnapshotsModule } from './modules/question_snapshots/question_snapshots.module';
import { AttemptAnswersModule } from './modules/attempt_answers/attempt_answers.module';
import { QuestionSnapshotEntity } from './modules/question_snapshots/entities/question_snapshot.entity';
import { AttemptAnswerEntity } from './modules/attempt_answers/entities/attempt_answer.entity';

@Module({
  imports: [
    // Kết nối MongoDB
    UsersModule,
    UserProfilesModule,

    AuthSessionsModule,

    OauthConnectionsModule,

    CoursesModule,

    CourseChaptersModule,

    LessonsModule,

    CourseEnrollmentsModule,

    QuizzesModule,

    MessageThreadsModule,

    MessagesModule,

    DiscussionsModule,

    DiscussionRepliesModule,

    SupportTicketsModule,

    TicketResponsesModule,

    FaqsModule,

    SystemSettingsModule,

    ActivityLogsModule,

    NotificationsModule,

    MediaFilesModule,

    RolesModule,

    PermissionsModule,

    RolePermissionsModule,

    CategoriesModule,

    PostsModule,

    AuthModule,
    
    PostTagsModule,

    UploadModule,

    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Kết nối PostgreSQL
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '22042004',
    //   database: 'db_test',
    //   schema: 'nest_postgres',
    //   entities: [UserEntity],
    //   synchronize: false,
    // }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'ItranEdu_Admin',
    //   password: 'Googleitranedu@123',
    //   database: 'ItranEdu_PostgreSQL_DB',
    //   schema: 'itranedu_schemas_main',
    //   entities: [UserEntity],
    //   synchronize: false,
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ItranEdu_Admin',
      password: 'Googleitranedu@123',
      database: 'ItranEdu_PostgreSQL_DB',
      schema: 'demo',
      entities: [
        UserEntity,
        ActivityLogEntity,
        AuthSessionEntity,
        CourseChapterEntity,
        CourseChapterEntity,
        CourseEnrollmentEntity,
        CourseEntity,
        DiscussionReplyEntity,
        DiscussionEntity,
        FaqEntity,
        LessonEntity,
        MediaFileEntity,
        MessageThreadEntity,
        MessageEntity,
        NotificationEntity,
        OauthConnectionEntity,
        PermissionEntity,
        QuizEntity,
        RolePermissionEntity,
        RoleEntity,
        SupportTicketEntity,
        SystemSettingEntity,
        TicketResponseEntity,
        UserProfileEntity,
        CategoryEntity,
        PostEntity,
        PostTagsEntity,
        PostCommentEntity,
        PostCommentLikeEntity,
        PostLikeEntity,
        NewsEntity,
        NewsTagsEntity,
        QuizAnswerEntity,
        QuizAttemptEntity,
        QuizQuestionEntity,
        DifficultyEntity,
        CategoryQuizEntity,
        QuestionSnapshotEntity,
        AttemptAnswerEntity,
      ],
      synchronize: false,
    }),

    // redis
    // CacheModule.register({}),

    // Mail
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          // ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    UploadModule,

    PostCommentsModule,

    PostCommentsLikesModule,

    PostLikesModule,

    NewsModule,

    NewsTagsModule,

    DifficultiesModule,

    QuizQuestionsModule,

    QuizAttemptsModule,

    CategoryQuizModule,

    QuestionSnapshotsModule,

    AttemptAnswersModule,

    QuestionSnapshotsModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
