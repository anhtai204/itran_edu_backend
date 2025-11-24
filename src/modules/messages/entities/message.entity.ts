import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    thread_id: string;

    @Column({ type: 'uuid' })
    sender_id: string;

    @Column({ type: 'uuid', nullable: true })
    receiver_id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'timestamp', nullable: true })
    read_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}