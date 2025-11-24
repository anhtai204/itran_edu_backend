import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type NewsTagDocument = HydratedDocument<NewsTag>;

@Schema({ timestamps: true })
export class NewsTag {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, default: uuidv4 }) 
  categories_id?: string[];
}

export const NewsTagSchema = SchemaFactory.createForClass(NewsTag);
