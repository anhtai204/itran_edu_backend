import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MessageThreadDocument = HydratedDocument<MessageThread>;


@Schema({ timestamps: true })
export class MessageThread {
    @Prop()
    title: string;
}
export const MessageThreadSchema = SchemaFactory.createForClass(MessageThread);