import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSnapshotsService } from './question_snapshots.service';
import { QuestionSnapshotsController } from './question_snapshots.controller';
import { QuestionSnapshotEntity } from './entities/question_snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSnapshotEntity])],
  controllers: [QuestionSnapshotsController],
  providers: [QuestionSnapshotsService],
  exports: [QuestionSnapshotsService],
})
export class QuestionSnapshotsModule {}
