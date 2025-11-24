import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TicketResponseDocument = HydratedDocument<TicketResponse>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class TicketResponse {
    @Prop({ required: true })
    ticket_id: number;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    content: string;
}

export const TicketResponseSchema = SchemaFactory.createForClass(TicketResponse);
