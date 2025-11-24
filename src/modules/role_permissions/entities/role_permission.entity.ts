import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role_permissions')
export class RolePermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role_id: number;

    @Column()
    permission_id: number;

    @CreateDateColumn()
    created_at: Date;
}