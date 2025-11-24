import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePostCommentsLikeDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  post_comment_id: string;
}
