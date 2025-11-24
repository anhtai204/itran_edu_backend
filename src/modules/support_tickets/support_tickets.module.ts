import { Module } from '@nestjs/common';
import { SupportTicketsService } from './support_tickets.service';
import { SupportTicketsController } from './support_tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportTicket, SupportTicketSchema } from './schema/support_ticket.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketEntity } from './entities/support_ticket.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: SupportTicket.name, schema: SupportTicketSchema}]),
  TypeOrmModule.forFeature([SupportTicketEntity])],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
  exports: [SupportTicketsService],
})

export class SupportTicketsModule {}
