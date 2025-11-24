import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';
import { NewsTag } from './schema/news_tag.schema';
import { NewsTagsEntity } from './entities/news_tag.entity';
import { CreateNewsTagDto } from './dto/create-news_tag.dto';
import { UpdateNewsTagDto } from './dto/update-news_tag.dto';

@Injectable()
export class NewsTagsService {
  constructor(
    // mongodb
    @InjectModel(NewsTag.name) private newsTagModel: Model<NewsTag>,

    // postgres
    @InjectRepository(NewsTagsEntity)
    private readonly newsTagRepository: Repository<NewsTagsEntity>,
  ) {}

  // Helper function to extract UUIDs from a string
  private extractUUIDs(input: string): string[] {
    return input
      .replace(/^\[|\]$/g, '') // Loại bỏ dấu [ và ]
      .split(',')
      .map((uuid) => uuid.trim().replace(/^'|'$/g, '')); // Loại bỏ dấu nháy đơn
  }

  async create(CreateNewsTagDto: CreateNewsTagDto) {
    const { name, description, slug } = CreateNewsTagDto;
    const newTag = this.newsTagRepository.create({
      name,
      description,
      slug,
    });
    return await this.newsTagRepository.save(newTag);
  }

  findAll() {
    return this.newsTagRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} newsTag`;
  }

  async updateNewsTag(UpdateNewsTagDto: UpdateNewsTagDto) {
    const tag = await this.newsTagRepository.findOne({
      where: { id: UpdateNewsTagDto.id },
    });
    if (!tag) {
      throw new BadRequestException('Tag không tồn tại');
    }
    Object.assign(tag, UpdateNewsTagDto);
    return await this.newsTagRepository.save(tag);
  }

  async deleteById(id: string) {
    const tag = await this.newsTagRepository.findOne({ where: { id } });
    return await this.newsTagRepository.remove(tag);
  }

  async findAllWithPaginate(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const queryBuilder = this.newsTagRepository
      .createQueryBuilder('news_tag')
      .select([
        'news_tag.id',
        'news_tag.name',
        'news_tag.slug',
        'news_tag.description',
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
