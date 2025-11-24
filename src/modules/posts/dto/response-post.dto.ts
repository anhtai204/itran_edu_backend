import { BlockData } from "../entities/post.entity";

export class PostResponseDto {
  id: string;
  author: string;
  create_at: Date;
  content: string;
  title: string;
  excerpt: string | null;
  description: string;
  post_status: string;
  visibility: string;
  comment_status: boolean;
  ping_status: boolean;
  slug: string;
  categories: string[];
  tags: string[];
  feature_image: string;
  scheduled_at: Date;
  blocks_data: BlockData[];
}
