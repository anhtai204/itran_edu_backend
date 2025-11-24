import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketResponsesService } from './ticket_responses.service';
import { CreateTicketResponseDto } from './dto/create-ticket_response.dto';
import { UpdateTicketResponseDto } from './dto/update-ticket_response.dto';

@Controller('ticket-responses')
export class TicketResponsesController {
  constructor(private readonly ticketResponsesService: TicketResponsesService) {}

  @Post()
  create(@Body() createTicketResponseDto: CreateTicketResponseDto) {
    return this.ticketResponsesService.create(createTicketResponseDto);
  }

  @Get()
  findAll() {
    return this.ticketResponsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketResponsesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketResponseDto: UpdateTicketResponseDto) {
    return this.ticketResponsesService.update(+id, updateTicketResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketResponsesService.remove(+id);
  }
}
