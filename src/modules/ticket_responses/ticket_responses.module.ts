import { Module } from '@nestjs/common';
import { TicketResponsesService } from './ticket_responses.service';
import { TicketResponsesController } from './ticket_responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketResponse, TicketResponseSchema } from './schema/ticket_response.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketResponseEntity } from './entities/ticket_response.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: TicketResponse.name, schema: TicketResponseSchema}]),
  TypeOrmModule.forFeature([TicketResponseEntity])],
  controllers: [TicketResponsesController],
  providers: [TicketResponsesService],
  exports: [TicketResponsesService],
})
export class TicketResponsesModule {}
