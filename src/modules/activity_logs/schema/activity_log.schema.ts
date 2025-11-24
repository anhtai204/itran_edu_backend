import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema({ timestamps: true })
export class ActivityLog {
    @Prop()
    user_id: string;

    @Prop({ required: true })
    action: string;

    @Prop()
    entity_type: string;

    @Prop()
    entity_id: number;

    @Prop()
    description: string;

    @Prop()
    ip_address: string;
}
export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);