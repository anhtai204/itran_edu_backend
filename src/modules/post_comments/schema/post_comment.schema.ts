import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PostCommentDocument = HydratedDocument<PostComment>;

@Schema({ timestamps: true })
export class PostComment {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ type: String, default: uuidv4 }) 
  user_id: string;

  @Prop({ type: String, default: uuidv4 }) 
  post_id: string;

  @Prop({ type: String, default: uuidv4 }) 
  parent_id: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Date }) 
  create_at: Date;

  @Prop({ type: Date }) 
  update_at?: Date;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
