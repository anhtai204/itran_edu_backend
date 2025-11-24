import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserProfileDocument = HydratedDocument<UserProfile>;

@Schema({ timestamps: true }) // Tự động thêm createdAt & updatedAt
export class UserProfile {
    
    @Prop()
    user_id: string;

    @Prop()
    date_of_birth: Date;

    @Prop()
    gender: string;

    @Prop()
    address: string;

    @Prop()
    bio: string;

    @Prop()
    education_level: string;

    @Prop()
    teaching_experience: number;

    @Prop()
    specialization: string;

    @Prop()
    parent_id: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
