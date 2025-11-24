import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lessons')
export class LessonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  chapter_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  content_type: string;

  @Column({ type: 'text', nullable: true })
  content_url: string;

  @Column({ type: 'integer', nullable: true })
  duration: number;

  @Column({ type: 'integer', nullable: true })
  sequence_number: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  language: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}