import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type DifficultyDocument = HydratedDocument<Difficulty>;

@Schema({ timestamps: true })
export class Difficulty {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, nullable: true })
  description: string;
}

export const DifficultySchema = SchemaFactory.createForClass(Difficulty);
