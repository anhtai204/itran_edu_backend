import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OauthConnectionDocument = HydratedDocument<OauthConnection>;

@Schema({ timestamps: true })
export class OauthConnection {

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    provider: string;

    @Prop({ required: true })
    provider_user_id: string;

    @Prop()
    access_token?: string;

    @Prop()
    refresh_token?: string;

    @Prop()
    expires_at?: Date;
}

export const OauthConnectionSchema = SchemaFactory.createForClass(OauthConnection);
