import { Module } from '@nestjs/common';
import { AuthSessionsService } from './auth_sessions.service';
import { AuthSessionsController } from './auth_sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSession, AuthSessionSchema } from './schema/auth_session.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSessionEntity } from './entities/auth_session.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuthSession.name, schema: AuthSessionSchema}]),
  TypeOrmModule.forFeature([AuthSessionEntity])],
  controllers: [AuthSessionsController],
  providers: [AuthSessionsService],
  exports: [AuthSessionsService],
})

export class AuthSessionsModule {}
