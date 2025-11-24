
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "news_tags", schema: "demo" }) // Định nghĩa bảng & schema
export class NewsTagsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "character", length: 200 })
  name: string;

  @Column({ type: "character", length: 200 })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string;

}
