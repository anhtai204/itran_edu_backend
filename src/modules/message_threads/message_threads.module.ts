import { Module } from '@nestjs/common';
import { MessageThreadsService } from './message_threads.service';
import { MessageThreadsController } from './message_threads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageThread, MessageThreadSchema } from './schema/message_thread.schema';
import { MessageThreadEntity } from './entities/message_thread.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MongooseModule.forFeature([{ name: MessageThread.name, schema: MessageThreadSchema}]),
  TypeOrmModule.forFeature([MessageThreadEntity])],
  controllers: [MessageThreadsController],
  providers: [MessageThreadsService],
  exports: [MessageThreadsService],
})
export class MessageThreadsModule {}
