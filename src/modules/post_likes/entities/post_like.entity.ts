import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('post_likes')
export class PostLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string; // ID của người dùng đã like

  @Column('uuid')
  post_id: string; // ID của comment được like

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; // Thời gian like
}
