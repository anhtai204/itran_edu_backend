import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePostCommentDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string; // ID của người dùng viết comment

  @IsUUID()
  @IsNotEmpty()
  post_id: string; // ID của bài post

  @IsUUID()
  @IsOptional()
  parent_id?: string; // ID của comment cha (nếu là reply), có thể null

  @IsString()
  @IsNotEmpty()
  content: string; // Nội dung comment

  @IsString()
  @IsOptional()
  status?: string; //pending || approved, mặc định là pending
}
