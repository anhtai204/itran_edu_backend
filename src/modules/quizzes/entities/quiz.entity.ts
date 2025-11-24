import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quizzes')
export class QuizEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  lesson_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: false })
  author_id: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @Column({ type: 'uuid', nullable: true })
  difficulty_id: string;

  @Column({ type: 'integer', default: 30 })
  time_limit: number;

  @Column({ type: 'integer', default: 70 })
  passing_score: number;

  @Column({ type: 'integer', default: 3 })
  max_attempts: number;

  @Column({ type: 'boolean', default: false })
  randomize_questions: boolean;

  @Column({ type: 'boolean', default: true })
  show_results: boolean;

  @Column({ type: 'boolean', default: true })
  show_correct_answers: boolean;

  @Column({ type: 'boolean', default: true })
  show_explanations: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'draft',
    enum: ['draft', 'published'],
  })
  status: 'draft' | 'published';
}
