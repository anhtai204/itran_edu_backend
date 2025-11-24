import { IsNotEmpty, IsUUID } from "class-validator";

export class CreatePostLikeDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  post_id: string;
}
