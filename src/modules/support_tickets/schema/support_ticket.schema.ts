import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupportTicketDocument = HydratedDocument<SupportTicket>;

@Schema({ timestamps: true })
export class SupportTicket {
    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: 'open' })
    status: string;

    @Prop({ default: 'normal' })
    priority: string;

    @Prop()
    assigned_to: string;
}
export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);