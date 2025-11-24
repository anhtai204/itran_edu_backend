import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ type: String, default: uuidv4 }) 
  author_id: string;

  @Prop({ type: Date }) 
  create_at: Date;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  excerpt?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  post_status?: string;

  @Prop({ type: String })
  visibility?: string;

  @Prop({ type: Boolean })
  comment_status?: boolean;

  @Prop({ type: Boolean })
  ping_status?: boolean;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Date }) 
  update_at?: Date;

  @Prop({ type: String, default: uuidv4 }) 
  categories_id?: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
