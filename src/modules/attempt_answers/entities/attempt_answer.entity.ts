import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attempt_answers')
export class AttemptAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  attempt_id: string;

  @Column({ type: 'uuid', nullable: true })
  snapshot_id: string;

  @Column({ type: 'jsonb', nullable: true })
  user_answer: JSON;

  @Column({ type: 'boolean', nullable: true })
  is_correct: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}
