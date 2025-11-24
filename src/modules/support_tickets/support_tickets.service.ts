import { Injectable } from '@nestjs/common';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support_ticket.dto';

@Injectable()
export class SupportTicketsService {
  create(createSupportTicketDto: CreateSupportTicketDto) {
    return 'This action adds a new supportTicket';
  }

  findAll() {
    return `This action returns all supportTickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supportTicket`;
  }

  update(id: number, updateSupportTicketDto: UpdateSupportTicketDto) {
    return `This action updates a #${id} supportTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} supportTicket`;
  }
}
