import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostCommentsLikesService } from './post_comments_likes.service';
import { CreatePostCommentsLikeDto } from './dto/create-post_comments_like.dto';
import { UpdatePostCommentsLikeDto } from './dto/update-post_comments_like.dto';
import { Public } from '@/decorator/customize';

@Controller('post-comments-likes')
export class PostCommentsLikesController {
  constructor(
    private readonly postCommentsLikesService: PostCommentsLikesService,
  ) {}

  @Post()
  @Public()
  create(@Body() createPostCommentsLikeDto: CreatePostCommentsLikeDto) {
    return this.postCommentsLikesService.create(createPostCommentsLikeDto);
  }

  @Delete('unlike/:user_id/:comment_id')
  @Public()
  removeByUserAndPost(
    @Param('user_id') user_id: string,
    @Param('comment_id') comment_id: string,
  ) {
    return this.postCommentsLikesService.unlikeComment(user_id, comment_id);
  }

  @Get('by-comment')
  @Public()
  async findByCommentId(@Query('post_comment_id') post_comment_id: string) {
    return this.postCommentsLikesService.findByCommentId(post_comment_id);
  }

  @Get('count/:post_comment_id')
  @Public()
  async countLikes(@Param('post_comment_id') postCommentId: string) {
    return this.postCommentsLikesService.countLikes(postCommentId);
  }
  

  @Get()
  @Public()
  findAll() {
    return this.postCommentsLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postCommentsLikesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostCommentsLikeDto: UpdatePostCommentsLikeDto,
  ) {
    return this.postCommentsLikesService.update(id, updatePostCommentsLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCommentsLikesService.remove(id);
  }
}
