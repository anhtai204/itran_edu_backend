import { Module } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';
import { DifficultiesController } from './difficulties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DifficultyEntity } from './entities/difficulty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DifficultyEntity])],
  controllers: [DifficultiesController],
  providers: [DifficultiesService],
  exports: [DifficultiesService],
})
export class DifficultiesModule {}
