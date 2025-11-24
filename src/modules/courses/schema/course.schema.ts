import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {

    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop()
    thumbnail_url?: string;

    @Prop({ required: true })
    teacher_id: string;

    @Prop()
    category_id?: string;

    @Prop({ default: 'draft' })
    status: string;

    @Prop()
    level?: string;

    @Prop()
    price?: number;

    @Prop()
    duration?: number;

    @Prop({ default: 'en' })
    language: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
