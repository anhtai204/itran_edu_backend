import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('media_files')
export class MediaFileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @Column()
    file_name: string;

    @Column()
    file_type: string;

    @Column()
    file_size: number;

    @Column()
    file_url: string;

    @Column({ nullable: true })
    thumbnail_url: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: object;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}