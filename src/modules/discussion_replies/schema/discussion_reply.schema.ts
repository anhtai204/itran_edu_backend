import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DiscussionReplyDocument = HydratedDocument<DiscussionReply>;


@Schema({ timestamps: true })
export class DiscussionReply {
    @Prop({ required: true })
    discussion_id: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    parent_reply_id: string;
}
export const DiscussionReplySchema = SchemaFactory.createForClass(DiscussionReply);