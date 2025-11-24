import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageThreadDto } from './create-message_thread.dto';

export class UpdateMessageThreadDto extends PartialType(CreateMessageThreadDto) {}
