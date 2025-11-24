import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthSessionDocument = HydratedDocument<AuthSession>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class AuthSession {

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    token: string;

    @Prop()
    refresh_token?: string;

    @Prop({ type: Object })
    device_info?: Record<string, any>;

    @Prop()
    ip_address?: string;

    @Prop({ required: true })
    expires_at: Date;
}

export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);
