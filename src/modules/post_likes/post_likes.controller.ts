import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostLikesService } from './post_likes.service';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';
import { Public } from '@/decorator/customize';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  @Public()
  create(@Body() createPostLikeDto: CreatePostLikeDto) {
    return this.postLikesService.create(createPostLikeDto);
  }

  @Delete('unlike/:user_id/:post_id')
  @Public()
  removeByUserAndPost(
    @Param('user_id') user_id: string,
    @Param('post_id') post_id: string,
  ) {
    return this.postLikesService.removeByUserAndPost(user_id, post_id);
  }

  @Get()
  findAll() {
    return this.postLikesService.findAll();
  }

  @Get('count-likes/:post_id')
  @Public()
  getCountLikesByIdPost(@Param('post_id') post_id: string) {
    return this.postLikesService.getCountLikesByIdPost(post_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostLikeDto: UpdatePostLikeDto) {
    return this.postLikesService.update(+id, updatePostLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postLikesService.remove(+id);
  }
  
}
