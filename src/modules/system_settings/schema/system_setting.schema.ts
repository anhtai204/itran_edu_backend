import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SystemSettingDocument = HydratedDocument<SystemSetting>;


@Schema({ timestamps: true })
export class SystemSetting {
    @Prop({ required: true, unique: true })
    setting_key: string;

    @Prop()
    setting_value: string;

    @Prop()
    description: string;
}
export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);
