import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NotificationDocument = HydratedDocument<Notification>;


@Schema({ timestamps: true })
export class Notification {
    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    content: string;

    @Prop()
    read_at: Date;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
