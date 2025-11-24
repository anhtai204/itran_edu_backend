import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'timestamp', nullable: true })
    read_at: Date;

    @CreateDateColumn()
    created_at: Date;
}