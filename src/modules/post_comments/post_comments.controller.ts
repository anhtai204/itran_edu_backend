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
import { PostCommentsService } from './post_comments.service';
import { CreatePostCommentDto } from './dto/create-post_comment.dto';
import { UpdatePostCommentDto } from './dto/update-post_comment.dto';
import { Public } from '@/decorator/customize';

// @Controller('post-comments')
// export class PostCommentsController {
//   constructor(private readonly postCommentsService: PostCommentsService) {}

//   @Post()
//   @Public()
//   async create(@Body() createPostCommentDto: CreatePostCommentDto) {
//     const newComment =
//       await this.postCommentsService.create(createPostCommentDto);
//     return newComment;
//   }

//   @Get()
//   @Public()
//   findAll() {
//     return this.postCommentsService.findAll();
//   }

//   @Get('pending')
//   @Public()
//   getPendingComments(
//     @Query() query: any,
//     @Query('current') current: string,
//     @Query('pageSize') pageSize: string,
//   ) {
//     return this.postCommentsService.getPendingComments(
//       query,
//       +current,
//       +pageSize,
//     );
//   }

//   @Get(':id')
//   @Public()
//   async findOne(@Param('id') id: string) {
//     const comment = await this.postCommentsService.findOne(id);
//     return comment;
//   }

//   @Get('get-by-post/:id')
//   @Public()
//   async getCommentsByPostId(@Param('id') postId: string) {
//     const comments = await this.postCommentsService.getCommentsByPostId(postId);
//     return comments;
//   }

//   @Patch(':id')
//   @Public()
//   async update(
//     @Param('id') id: string,
//     @Body() updatePostCommentDto: UpdatePostCommentDto,
//   ) {
//     const updatedComment = await this.postCommentsService.update(
//       id,
//       updatePostCommentDto,
//     );
//     return updatedComment;
//   }

//   @Delete(':id')
//   @Public()
//   async remove(@Param('id') id: string) {
//     return await this.postCommentsService.remove(id);
//   }
// }


@Controller("post-comments")
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Post()
  @Public()
  async create(@Body() createPostCommentDto: CreatePostCommentDto) {
    const newComment =
      await this.postCommentsService.create(createPostCommentDto);
    return newComment;
  }

  @Get()
  @Public()
  findAll() {
    return this.postCommentsService.findAll()
  }

  @Get("pending")
  @Public()
  getPendingComments(@Query() query: any, @Query('current') current: string, @Query('pageSize') pageSize: string) {
    return this.postCommentsService.getPendingComments(query, +current, +pageSize)
  }

  @Get('replies/:id')
  @Public()
  async getRepliesByParentId(@Param('id') parentId: string) {
    const replies = await this.postCommentsService.getRepliesByParentId(parentId);
    return replies;
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const comment = await this.postCommentsService.findOne(id);
    return comment;
  }

  @Get('get-by-post/:id')
  @Public()
  async getCommentsByPostId(@Param('id') postId: string) {
    const comments = await this.postCommentsService.getCommentsByPostId(postId);
    return comments;
  }

  @Patch(":id")
  @Public()
  async update(@Param('id') id: string, @Body() updatePostCommentDto: UpdatePostCommentDto) {
    const updatedComment = await this.postCommentsService.update(id, updatePostCommentDto)
    return updatedComment
  }

  @Delete(":id")
  @Public()
  async remove(@Param('id') id: string, @Query('deleteReplies') deleteReplies?: string) {
    return await this.postCommentsService.remove(id, deleteReplies === "true")
  }
}


