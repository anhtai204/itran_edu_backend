import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  author_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @Column('text')
  content: string;

  @Column({ type: 'character', length: 200 })
  title: string;

  @Column('text', { nullable: true })
  excerpt?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ type: 'character', length: 20, nullable: true })
  news_status?: string;

  @Column({ type: 'character', length: 20, nullable: true })
  visibility?: string;

  @Column({ type: 'character', length: 200 })
  slug: string;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  update_at?: Date;

  @Column('uuid', { array: true, nullable: true })
  categories_id: string[];

  @Column('uuid', { array: true, nullable: true })
  tags_id: string[];

  @Column({ type: 'text', nullable: true })
  feature_image?: string;

  @Column({type: 'timestamp with time zone', nullable: true})
  scheduled_at?: Date;

  @Column({ type: "jsonb", nullable: true })
  blocks_data?: BlockData[];
}

export interface BlockData {
  id: string;
  type: 'text' | 'image' | 'video' | 'quote' | 'code';
  content: string | null; 
  previewUrl?: string;
}
