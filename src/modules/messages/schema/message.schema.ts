import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
    @Prop()
    thread_id: string;

    @Prop({ required: true })
    sender_id: string;

    @Prop()
    receiver_id: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    read_at: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);