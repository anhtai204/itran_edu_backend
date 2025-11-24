import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('courses')
export class CourseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail_url?: string;

    @Column({ type: 'uuid', nullable: false })
    teacher_id: string;

    @Column({ type: 'uuid', nullable: true })
    category_id?: string;

    @Column({ type: 'varchar', length: 20, default: 'draft' })
    status: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    level?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price?: number;

    @Column({ type: 'integer', nullable: true })
    duration?: number;

    @Column({ type: 'varchar', length: 10, default: 'en' })
    language: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
