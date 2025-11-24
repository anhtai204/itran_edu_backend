import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Faq, FaqSchema } from './schema/faq.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqEntity } from './entities/faq.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema}]),
  TypeOrmModule.forFeature([FaqEntity])],
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
