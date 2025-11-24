import { PartialType } from '@nestjs/mapped-types';
import { CreatePostCommentsLikeDto } from './create-post_comments_like.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdatePostCommentsLikeDto extends PartialType(
  CreatePostCommentsLikeDto,
) {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  post_comment_id: string;
}
