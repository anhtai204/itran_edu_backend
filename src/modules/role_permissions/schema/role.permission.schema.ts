import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RolePermissionDocument = HydratedDocument<RolePermission>;


@Schema({ timestamps: true })
export class RolePermission {
    @Prop({ required: true })
    role_id: number;

    @Prop({ required: true })
    permission_id: number;
}
export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);