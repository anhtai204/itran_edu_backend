import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('support_tickets')
export class SupportTicketEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 255 })
    subject: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 20, default: 'open' })
    status: string;

    @Column({ type: 'varchar', length: 20, default: 'normal' })
    priority: string;

    @Column({ type: 'uuid', nullable: true })
    assigned_to: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}