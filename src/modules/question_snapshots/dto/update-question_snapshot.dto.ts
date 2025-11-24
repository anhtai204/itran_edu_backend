import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionSnapshotDto } from './create-question_snapshot.dto';

export class UpdateQuestionSnapshotDto extends PartialType(CreateQuestionSnapshotDto) {}
