import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('activity_logs')
export class ActivityLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @Column()
    action: string;

    @Column({ nullable: true })
    entity_type: string;

    @Column({ nullable: true })
    entity_id: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    ip_address: string;

    @CreateDateColumn()
    created_at: Date;
}