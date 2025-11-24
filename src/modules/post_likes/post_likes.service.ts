import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostLikes } from './schema/post_like.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeEntity } from './entities/post_like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikesService {
  constructor(
    // mongodb
    @InjectModel(PostLikes.name)
    private postLikesModel: Model<PostLikes>,

    // postgres
    @InjectRepository(PostLikeEntity)
    private readonly postLikesRepository: Repository<PostLikeEntity>,
  ) {}

  findAll() {
    return `This action returns all postLikes`;
  }

  getCountLikesByIdPost(id: string) {
    return this.postLikesRepository.count({
      where: { post_id: id },
    });
  }

  update(id: number, updatePostLikeDto: UpdatePostLikeDto) {
    return `This action updates a #${id} postLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} postLike`;
  }

  // Tạo lượt like
  async create(createPostLikeDto: CreatePostLikeDto): Promise<PostLikeEntity> {
    const { user_id, post_id } = createPostLikeDto;

    // Kiểm tra xem user đã like post này chưa
    const existingLike = await this.postLikesRepository.findOne({
      where: { user_id, post_id },
    });
    if (existingLike) {
      throw new BadRequestException('User has already liked this post');
    }

    const like = this.postLikesRepository.create({ user_id, post_id });
    return this.postLikesRepository.save(like);
  }

  // Xóa lượt like
  async removeByUserAndPost(user_id: string, post_id: string): Promise<void> {
    const result = await this.postLikesRepository.delete({ user_id, post_id });
    if (result.affected === 0) {
      throw new BadRequestException('Like not found');
    }
  }
}
