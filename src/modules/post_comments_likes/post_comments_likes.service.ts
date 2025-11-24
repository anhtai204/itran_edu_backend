import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostCommentsLikeDto } from './dto/create-post_comments_like.dto';
import { UpdatePostCommentsLikeDto } from './dto/update-post_comments_like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentLikes } from './schema/post_comments_like.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCommentLikeEntity } from './entities/post_comments_like.entity';
import { Repository } from 'typeorm';
import { PostCommentEntity } from '../post_comments/entities/post_comment.entity';
import { UserEntity } from '../users/entities/users.entity';

@Injectable()
export class PostCommentsLikesService {
  constructor(
    // mongodb
    @InjectModel(PostCommentLikes.name)
    private postCommentLikesModel: Model<PostCommentLikes>,

    // postgres
    @InjectRepository(PostCommentLikeEntity)
    private readonly postCommentLikesRepository: Repository<PostCommentLikeEntity>,
  ) {}

  // Tạo lượt like
  async create(createPostLikeDto: CreatePostCommentsLikeDto): Promise<PostCommentLikeEntity> {
    const { user_id, post_comment_id } = createPostLikeDto;

    // Kiểm tra xem user đã like post này chưa
    const existingCommentLike = await this.postCommentLikesRepository.findOne({
      where: { user_id, post_comment_id },
    });
    if (existingCommentLike) {
      throw new BadRequestException('User has already liked this comment');
    }

    const like = this.postCommentLikesRepository.create({ user_id, post_comment_id });
    return this.postCommentLikesRepository.save(like);
  }

  findAll() {
    return this.postCommentLikesRepository.find(); // For PostgreSQL, return all records from the PostCommentLikeEntity table
  }

  findOne(id: string) {
    return `This action returns a #${id} postCommentsLike`;
  }

  update(id: string, updatePostCommentsLikeDto: UpdatePostCommentsLikeDto) {
    return `This action updates a #${id} postCommentsLike`;
  }

  remove(id: string) {
    return `This action removes a #${id} postCommentsLike`;
  }

  // Lấy tất cả lượt like của một comment
  async findByCommentId(
    postCommentId: string,
  ): Promise<PostCommentLikeEntity[]> {
    return this.postCommentLikesRepository.find({
      where: { post_comment_id: postCommentId },
      order: { created_at: 'ASC' },
    });
  }

  // Đếm số lượt like của một comment
  async countLikes(postCommentId: string): Promise<number> {
    return this.postCommentLikesRepository.count({
      where: { post_comment_id: postCommentId },
    });
  }

  // Xóa lượt like
  async unlikeComment(userId: string, commentId: string) {
    const like = await this.postCommentLikesRepository.findOne({
      where: {
        user_id: userId,
        post_comment_id: commentId,
      },
    })

    if (!like) {
      return { statusCode: 404, message: "Like not found" }
    }

    await this.postCommentLikesRepository.remove(like)
  }
}
