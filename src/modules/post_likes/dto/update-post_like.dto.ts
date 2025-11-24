import { PartialType } from '@nestjs/mapped-types';
import { CreatePostLikeDto } from './create-post_like.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdatePostLikeDto extends PartialType(CreatePostLikeDto) {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  post_id: string;
}
