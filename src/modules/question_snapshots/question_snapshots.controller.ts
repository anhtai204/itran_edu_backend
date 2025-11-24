import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionSnapshotsService } from './question_snapshots.service';
import { CreateQuestionSnapshotDto } from './dto/create-question_snapshot.dto';
import { UpdateQuestionSnapshotDto } from './dto/update-question_snapshot.dto';

@Controller('question-snapshots')
export class QuestionSnapshotsController {
  constructor(private readonly questionSnapshotsService: QuestionSnapshotsService) {}

  @Post()
  create(@Body() createQuestionSnapshotDto: CreateQuestionSnapshotDto) {
    return this.questionSnapshotsService.create(createQuestionSnapshotDto);
  }

  @Get()
  findAll() {
    return this.questionSnapshotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionSnapshotsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionSnapshotDto: UpdateQuestionSnapshotDto) {
    return this.questionSnapshotsService.update(id, updateQuestionSnapshotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionSnapshotsService.remove(id);
  }

  @Post()
  async saveQuestionSnapshot(){

  }
}
