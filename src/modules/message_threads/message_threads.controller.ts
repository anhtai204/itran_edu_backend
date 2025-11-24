import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageThreadsService } from './message_threads.service';
import { CreateMessageThreadDto } from './dto/create-message_thread.dto';
import { UpdateMessageThreadDto } from './dto/update-message_thread.dto';

@Controller('message-threads')
export class MessageThreadsController {
  constructor(private readonly messageThreadsService: MessageThreadsService) {}

  @Post()
  create(@Body() createMessageThreadDto: CreateMessageThreadDto) {
    return this.messageThreadsService.create(createMessageThreadDto);
  }

  @Get()
  findAll() {
    return this.messageThreadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageThreadsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageThreadDto: UpdateMessageThreadDto) {
    return this.messageThreadsService.update(+id, updateMessageThreadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageThreadsService.remove(+id);
  }
}
