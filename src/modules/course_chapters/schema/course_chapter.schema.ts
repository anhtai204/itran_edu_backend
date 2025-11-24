import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseChapterDocument = HydratedDocument<CourseChapter>;

@Schema({ timestamps: true })
export class CourseChapter {

    @Prop({ required: true })
    course_id: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    sequence_number: number;
}

export const CourseChapterSchema = SchemaFactory.createForClass(CourseChapter);
