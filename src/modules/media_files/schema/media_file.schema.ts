import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MediaFileDocument = HydratedDocument<MediaFile>;


@Schema({ timestamps: true })
export class MediaFile {
    @Prop()
    user_id: string;

    @Prop({ required: true })
    file_name: string;

    @Prop({ required: true })
    file_type: string;

    @Prop({ required: true })
    file_size: number;

    @Prop({ required: true })
    file_url: string;

    @Prop()
    thumbnail_url: string;

    @Prop()
    metadata: string;
}
export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);