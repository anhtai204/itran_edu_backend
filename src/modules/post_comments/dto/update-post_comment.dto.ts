import { PartialType } from '@nestjs/mapped-types';
import { CreatePostCommentDto } from './create-post_comment.dto';

export class UpdatePostCommentDto extends PartialType(CreatePostCommentDto) {}
