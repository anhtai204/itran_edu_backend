import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostTagDto } from './dto/create-post_tag.dto';
import { UpdatePostTagDto } from './dto/update-post_tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostTag } from './schema/post_tag.schema';
import { Model } from 'mongoose';
import { Post } from '../posts/schema/post.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTagsEntity } from './entities/post_tag.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class PostTagsService {
  constructor(
    // mongodb
    @InjectModel(PostTag.name) private postTagModel: Model<PostTag>,

    // postgres
    @InjectRepository(PostTagsEntity)
    private readonly postTagRepository: Repository<PostTagsEntity>,
  ) {}

  // Helper function to extract UUIDs from a string
  private extractUUIDs(input: string): string[] {
    return input
      .replace(/^\[|\]$/g, '') // Loại bỏ dấu [ và ]
      .split(',')
      .map((uuid) => uuid.trim().replace(/^'|'$/g, '')); // Loại bỏ dấu nháy đơn
  }

  async create(createPostTagDto: CreatePostTagDto) {
    const { name, description, slug } = createPostTagDto;
    const newTag = this.postTagRepository.create({
      name,
      description,
      slug,
    });
    return await this.postTagRepository.save(newTag);
  }

  findAll() {
    return this.postTagRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} postTag`;
  }

  async updatePostTag(updatePostTagDto: UpdatePostTagDto) {
    const tag = await this.postTagRepository.findOne({
      where: { id: updatePostTagDto.id },
    });
    if (!tag) {
      throw new BadRequestException('Tag không tồn tại');
    }
    Object.assign(tag, updatePostTagDto);
    return await this.postTagRepository.save(tag);
  }

  async deleteById(id: string) {
    const tag = await this.postTagRepository.findOne({ where: { id } });
    return await this.postTagRepository.remove(tag);
  }

  async findAllWithPaginate(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const queryBuilder = this.postTagRepository
      .createQueryBuilder('post_tag')
      .select([
        'post_tag.id',
        'post_tag.name',
        'post_tag.slug',
        'post_tag.description',
      ])
      .where(filter)
      .orderBy(sort as any)
      .skip((current - 1) * pageSize) // Offset
      .take(pageSize); // Limit

    const [results, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }
}
