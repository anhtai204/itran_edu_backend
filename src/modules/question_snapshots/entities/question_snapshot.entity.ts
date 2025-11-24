import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question_snapshots')
export class QuestionSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  quiz_id: string;

  @Column({ type: 'uuid', nullable: true })
  attempt_id: string;

  @Column({ type: 'uuid', nullable: true })
  question_id: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  options: JSON;

  @Column({ type: 'jsonb', nullable: false })
  correct_answer: JSON;

  @Column({
    type: 'varchar',
    length: 20,
    enum: ['single-choice', 'multiple-choice', 'true-false', 'matching', 'image-matching', 'fill-blanks'],
  })
  question_type: string;

  @Column({ type: 'integer', nullable: true })
  points: number;

  @Column({ type: 'integer', nullable: true })
  question_order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
