import { Injectable } from '@nestjs/common';
import { CreateTicketResponseDto } from './dto/create-ticket_response.dto';
import { UpdateTicketResponseDto } from './dto/update-ticket_response.dto';

@Injectable()
export class TicketResponsesService {
  create(createTicketResponseDto: CreateTicketResponseDto) {
    return 'This action adds a new ticketResponse';
  }

  findAll() {
    return `This action returns all ticketResponses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketResponse`;
  }

  update(id: number, updateTicketResponseDto: UpdateTicketResponseDto) {
    return `This action updates a #${id} ticketResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketResponse`;
  }
}
