import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quiz_answers')
export class QuizAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  attempt_id: string;

  @Column({ type: 'uuid', nullable: true })
  question_id: string;

  @Column({ type: 'jsonb', nullable: true })
  answer_text: any; // JSONB để lưu trữ câu trả lời phức tạp

  @Column({ type: 'boolean' })
  is_correct: boolean;

  @Column({ type: 'integer', default: 0 })
  points_earned: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}