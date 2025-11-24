import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketResponseDto } from './create-ticket_response.dto';

export class UpdateTicketResponseDto extends PartialType(CreateTicketResponseDto) {}
