import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('discussion_replies')
export class DiscussionReplyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    discussion_id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'uuid', nullable: true })
    parent_reply_id: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}