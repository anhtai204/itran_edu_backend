import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type QuizQuestionContent =
  | { options: { id: string; text: string; is_correct: boolean }[] } // single-choice, multiple-choice
  | { correct_answer: boolean } // true-false
  // | { pairs: { item: string; match: string }[] } // matching ui
  | { items: {id: string, text: string}[], matches: {id: string, text: string}[], correct_matches: {item_id: string, match_id: string}[]} // matching save
  // | { pairs: { image_url: string; label: string }[] } // image-matching ui
  | { labels: {id: string, text: string}[], image_urls: {id: string, url: string}[], correct_image_matches: {url_id: string, label_id: string}[]} // image maching save
  // | { answers: string[] }; // fill-blanks
  | { answers: {id: string, text: string}[], correct_answers: string[] }

@Entity('quiz_questions')
export class QuizQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  quiz_id: string;

  @Column({ type: 'text' })
  question_text: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: [
      'single-choice',
      'multiple-choice',
      'true-false',
      'matching',
      'image-matching',
      'fill-blanks',
    ],
  })
  question_type: string;


  @Column({ type: 'jsonb', nullable: true })
  content: QuizQuestionContent;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'integer', default: 1 })
  points: number;

  @Column({ type: 'integer' })
  question_order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}