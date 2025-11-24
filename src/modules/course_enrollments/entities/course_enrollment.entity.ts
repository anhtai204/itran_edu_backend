import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('course_enrollments')
@Unique(['course_id', 'user_id'])
export class CourseEnrollmentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    course_id: string;

    @Column({ type: 'uuid', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', length: 20, default: 'active' })
    status: string;

    @Column({ type: 'float', default: 0 })
    progress: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    enrollment_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    completion_date?: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
