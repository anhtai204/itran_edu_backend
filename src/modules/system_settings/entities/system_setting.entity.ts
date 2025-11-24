import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('system_settings')
export class SystemSettingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    setting_key: string;

    @Column({ type: 'text', nullable: true })
    setting_value: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}