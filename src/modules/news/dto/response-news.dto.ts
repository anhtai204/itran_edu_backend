import { BlockData } from "../entities/news.entity";

export class NewsResponseDto {
  id: string;
  author: string;
  create_at: Date;
  content: string;
  title: string;
  excerpt: string | null;
  description: string;
  news_status: string;
  visibility: string;
  slug: string;
  categories: string[];
  tags: string[];
  feature_image: string;
  scheduled_at: Date;
  blocks_data: BlockData[];
}
