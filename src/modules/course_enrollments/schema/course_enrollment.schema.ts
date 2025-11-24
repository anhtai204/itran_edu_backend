import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseEnrollmentDocument = HydratedDocument<CourseEnrollment>;

@Schema({ timestamps: true })
export class CourseEnrollment {

    @Prop({ required: true })
    course_id: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: 0 })
    progress: number;

    @Prop({ default: Date.now })
    enrollment_date: Date;

    @Prop()
    completion_date?: Date;
}

export const CourseEnrollmentSchema = SchemaFactory.createForClass(CourseEnrollment);
