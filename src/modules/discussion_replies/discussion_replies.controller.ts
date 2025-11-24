import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscussionRepliesService } from './discussion_replies.service';
import { CreateDiscussionReplyDto } from './dto/create-discussion_reply.dto';
import { UpdateDiscussionReplyDto } from './dto/update-discussion_reply.dto';

@Controller('discussion-replies')
export class DiscussionRepliesController {
  constructor(private readonly discussionRepliesService: DiscussionRepliesService) {}

  @Post()
  create(@Body() createDiscussionReplyDto: CreateDiscussionReplyDto) {
    return this.discussionRepliesService.create(createDiscussionReplyDto);
  }

  @Get()
  findAll() {
    return this.discussionRepliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionRepliesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscussionReplyDto: UpdateDiscussionReplyDto) {
    return this.discussionRepliesService.update(+id, updateDiscussionReplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussionRepliesService.remove(+id);
  }
}
