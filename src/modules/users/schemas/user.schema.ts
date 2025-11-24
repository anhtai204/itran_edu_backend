import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, default: uuidv4 }) 
  id: string;

  @Prop({ type: String, required: true, unique: true, maxlength: 50 }) 
  username: string;

  @Prop({ type: String, required: true, unique: true, maxlength: 100 }) 
  email: string;

  @Prop({ type: String, maxlength: 20 }) 
  phone?: string;

  @Prop({ type: String, required: true }) 
  password_hash: string;

  @Prop({ type: String }) 
  address?: string;

  @Prop({ type: String, maxlength: 100 }) 
  full_name?: string;

  @Prop({ type: String }) 
  avatar_url?: string;

  @Prop({ type: Number, required: true }) 
  role_id: number;

  @Prop({ type: Boolean, default: true }) 
  is_active: boolean;

  @Prop({ type: String, maxlength: 50 }) 
  code_id?: string;

  @Prop({ type: Date }) 
  code_expired?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
