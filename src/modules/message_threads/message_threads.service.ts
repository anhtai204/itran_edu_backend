import { Injectable } from '@nestjs/common';
import { CreateMessageThreadDto } from './dto/create-message_thread.dto';
import { UpdateMessageThreadDto } from './dto/update-message_thread.dto';

@Injectable()
export class MessageThreadsService {
  create(createMessageThreadDto: CreateMessageThreadDto) {
    return 'This action adds a new messageThread';
  }

  findAll() {
    return `This action returns all messageThreads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageThread`;
  }

  update(id: number, updateMessageThreadDto: UpdateMessageThreadDto) {
    return `This action updates a #${id} messageThread`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageThread`;
  }
}
