import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PostCommentLikesDocument = HydratedDocument<PostCommentLikes>;

@Schema({ timestamps: true })
export class PostCommentLikes {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ type: String, default: uuidv4 }) 
  user_id: string;

  @Prop({ type: String, default: uuidv4 }) 
  post_comment_id: string; // ID của comment được like

  @Prop({ type: Date }) 
  created_at?: Date;
}

export const PostCommentLikesSchema = SchemaFactory.createForClass(PostCommentLikes);
