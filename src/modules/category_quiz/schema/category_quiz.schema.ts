import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type CategoryQuizDocument = HydratedDocument<CategoryQuiz>;

@Schema({ timestamps: true })
export class CategoryQuiz {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop()
    description?: string;

    @Prop()
    parent_id: string;
}

export const CategoryQuizSchema = SchemaFactory.createForClass(CategoryQuiz);
