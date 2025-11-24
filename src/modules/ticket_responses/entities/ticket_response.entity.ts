import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ticket_responses')
export class TicketResponseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    ticket_id: number;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
