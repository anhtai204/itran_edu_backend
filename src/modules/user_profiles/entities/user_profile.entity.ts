import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    userId: string; // Không có @ManyToOne, chỉ lưu UUID

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({ type: 'varchar', length: 10, nullable: true })
    gender: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    educationLevel: string;

    @Column({ type: 'int', nullable: true })
    teachingExperience: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    specialization: string;

    @Column({ type: 'uuid', nullable: true })
    parentId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
