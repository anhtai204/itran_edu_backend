import { QuizQuestionContent } from '@/modules/quiz_questions/entities/quiz_question.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quiz_attempts')
export class QuizAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  quiz_id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'integer', nullable: true })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @Column({
    type: 'varchar',
    length: 20,
    enum: ['in_progress', 'completed', 'cancelled'],
  })
  status: string;

  // add is_passed column
  @Column({ type: 'boolean', default: false })
  is_passed: boolean;

}
