import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type DiscussionDocument = HydratedDocument<Discussion>;


@Schema({ timestamps: true })
export class Discussion {
    @Prop({ required: true })
    course_id: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: 'active' })
    status: string;
}
export const DiscussionSchema = SchemaFactory.createForClass(Discussion);