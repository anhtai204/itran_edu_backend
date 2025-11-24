import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionSnapshotDto } from './dto/create-question_snapshot.dto';
import { UpdateQuestionSnapshotDto } from './dto/update-question_snapshot.dto';
import { QuestionSnapshotEntity } from './entities/question_snapshot.entity';

@Injectable()
export class QuestionSnapshotsService {
  constructor(
    @InjectRepository(QuestionSnapshotEntity)
    private readonly questionSnapshotRepository: Repository<QuestionSnapshotEntity>,
  ) {}

  async create(createQuestionSnapshotDto: CreateQuestionSnapshotDto) {
    const snapshot = this.questionSnapshotRepository.create(createQuestionSnapshotDto);
    return await this.questionSnapshotRepository.save(snapshot);
  }

  async createMany(createQuestionSnapshotDtos: CreateQuestionSnapshotDto[]) {
    const snapshots = createQuestionSnapshotDtos.map(dto => 
      this.questionSnapshotRepository.create(dto)
    );
    return await this.questionSnapshotRepository.save(snapshots);
  }

  findAll() {
    return this.questionSnapshotRepository.find();
  }

  findOne(id: string) {
    return this.questionSnapshotRepository.findOne({ where: { id } });
  }

  update(id: string, updateQuestionSnapshotDto: UpdateQuestionSnapshotDto) {
    return this.questionSnapshotRepository.update(id, updateQuestionSnapshotDto);
  }

  remove(id: string) {
    return this.questionSnapshotRepository.delete(id);
  }
}
