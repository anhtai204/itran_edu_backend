import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, type Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../users/entities/users.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import aqp from 'api-query-params';
import { News } from './schema/news.schema';
import { NewsEntity } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsResponseDto } from './dto/response-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    // mongodb
    @InjectModel(News.name) private newsModel: Model<News>,

    // postgres
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll() {
    return this.newsRepository.find();
  }

  async findOne(id: string): Promise<NewsEntity> {
    return this.newsRepository.findOne({ where: { id } });
  }

  async removeNewsById(id: string) {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new BadRequestException('News không tồn tại');
    }
    return await this.newsRepository.remove(news);
  }

  // Helper function to extract UUIDs from a string
  private extractUUIDs(input: string): string[] {
    return input
      .replace(/^\[|\]$/g, '') // Loại bỏ dấu [ và ]
      .split(',')
      .map((uuid) => uuid.trim().replace(/^'|'$/g, '')); // Loại bỏ dấu nháy đơn
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/[^a-z0-9-]/g, '') // Xóa ký tự không hợp lệ
      .slice(0, 50); // Giới hạn độ dài slug
  }

  async create(createNewsDto: CreateNewsDto) {
    try {
      const {
        title,
        content,
        blocks_data, // Đã là object, không cần JSON.parse
        description,
        excerpt,
        news_status,
        slug,
        categories_id,
        tags_id,
        author_id,
        visibility,
        feature_image,
        scheduled_at,
        create_at,
      } = createNewsDto;

      // Validate required fields
      if (!title || !content) {
        throw new Error('Title and content are required');
      }
      if (!author_id) {
        throw new BadRequestException('Author ID is required');
      }

      // Format categories_id
      let formattedCategories: string[] = [];
      if (typeof categories_id === 'string') {
        formattedCategories = this.extractUUIDs(categories_id);
      } else if (Array.isArray(categories_id)) {
        formattedCategories = categories_id;
      }

      // Format tags_id
      let formattedTags: string[] = [];
      if (typeof tags_id === 'string') {
        formattedTags = this.extractUUIDs(tags_id);
      } else if (Array.isArray(tags_id)) {
        formattedTags = tags_id;
      }

      // Validate author_id
      const authorExists = await this.userRepository.findOne({
        where: { id: author_id },
      });
      if (!authorExists) {
        throw new BadRequestException('Author does not exist');
      }

      // Generate slug if not provided
      const finalSlug = slug || this.generateSlug(title);

      // Check if slug is unique
      const existingNews = await this.newsRepository.findOne({
        where: { slug: finalSlug },
      });
      if (existingNews) {
        throw new ConflictException('A news with this slug already exists');
      }

      // Create new news
      const news = this.newsRepository.create({
        title,
        content,
        blocks_data, // Lưu trực tiếp dưới dạng object, PostgreSQL sẽ tự chuyển thành JSONB
        description,
        excerpt,
        news_status,
        slug,
        categories_id: formattedCategories,
        tags_id: formattedTags,
        visibility,
        author_id,
        feature_image,
        scheduled_at,
        create_at,
      });

      return await this.newsRepository.save(news);
    } catch (error) {
      throw new Error(`Failed to create news: ${error.message}`);
    }
  }

  async getEachNews() {
    const query = `
         WITH category_news_count AS (
            SELECT 
                c.id,
                c.name, 
                COUNT(p.id) AS count
            FROM demo.categories c
            LEFT JOIN demo.news p ON c.id = ANY(p.categories_id)
            GROUP BY c.id, c.name
            HAVING COUNT(p.id) > 0
        ),
        total_count AS (
            SELECT SUM(count) AS count FROM category_news_count
        )
        SELECT id, name, count FROM category_news_count
        UNION ALL
        SELECT NULL AS id, 'All' AS name, (SELECT count FROM total_count) AS count
        ORDER BY count DESC;
    `;

    try {
      const result = await this.newsRepository.query(query);
      console.log('Raw result:', result); // Debug để kiểm tra dữ liệu
      return result.map((row) => ({
        id: row.id, // Thêm id vào kết quả
        name: row.name,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error('Error fetching news counts:', error);
      throw error;
    }
  }

  async getNewsBySlug(slug: string) {
    return this.newsRepository.findOne({ where: { slug } });
  }

  // async getCustomNews(
  //   query: any,
  //   current: number,
  //   pageSize: number,
  //   search?: string,
  // ) {
  //   const { filter, sort } = aqp(query);

  //   if (filter.current) delete filter.current;
  //   if (filter.pageSize) delete filter.pageSize;
  //   if (filter.search) delete filter.search;

  //   if (!current) current = 1;
  //   if (!pageSize) pageSize = 6;

  //   // Create a query builder
  //   const queryBuilder = this.newsRepository.createQueryBuilder('news');

  //   // Apply search filter if provided
  //   if (search) {
  //     queryBuilder.where(
  //       '(news.title ILIKE :search OR news.description ILIKE :search)',
  //       { search: `%${search}%` },
  //     );
  //   }

  //   // Apply other filters from query params
  //   if (Object.keys(filter).length > 0) {
  //     Object.keys(filter).forEach((key) => {
  //       if (key === 'news_status') {
  //         queryBuilder.andWhere(`news.${key} = :${key}`, {
  //           [key]: filter[key],
  //         });
  //       }
  //     });
  //   }

  //   // Count total items for pagination
  //   const totalItems = await queryBuilder.getCount();

  //   // Apply pagination
  //   queryBuilder.skip((current - 1) * pageSize).take(pageSize);

  //   // Apply sorting
  //   if (sort) {
  //     const sortField = Object.keys(sort)[0];
  //     const sortOrder = sort[sortField] === 1 ? 'ASC' : 'DESC';
  //     queryBuilder.orderBy(`news.${sortField}`, sortOrder as 'ASC' | 'DESC');
  //   } else {
  //     queryBuilder.orderBy('news.create_at', 'DESC');
  //   }

  //   // Get news IDs from the filtered query
  //   const newsIds = await queryBuilder
  //     .select('news.id')
  //     .getMany()
  //     .then((news) => news.map((a) => a.id));

  //   if (newsIds.length === 0) {
  //     return {
  //       meta: {
  //         current,
  //         pageSize,
  //         pages: 0,
  //         total: 0,
  //       },
  //       results: [],
  //     };
  //   }

  //   // Get detailed news data with joins
  //   const newsQuery = this.newsRepository
  //     .createQueryBuilder('news')
  //     .leftJoin('users', 'user', 'user.id = news.author_id')
  //     .leftJoin(
  //       'categories',
  //       'category',
  //       'category.id = ANY(news.categories_id)',
  //     )
  //     .select([
  //       'news.id',
  //       'user.username AS author',
  //       'news.content AS content',
  //       'news.create_at AS create_at',
  //       'news.description AS description',
  //       'news.excerpt AS excerpt',
  //       'news.news_status AS news_status',
  //       'news.visibility AS visibility',
  //       'news.scheduled_at AS scheduled_at',
  //       'news.slug AS slug',
  //       'news.title AS title',
  //       'news.feature_image AS feature_image',
  //       'ARRAY_AGG(category.name) AS categories',
  //     ])
  //     .where('news.id IN (:...newsIds)', { newsIds })
  //     .groupBy('news.id, user.username');

  //   const news = await newsQuery.getRawMany();

  //   const totalPages = Math.ceil(totalItems / pageSize);

  //   return {
  //     meta: {
  //       current,
  //       pageSize,
  //       pages: totalPages,
  //       total: totalItems,
  //     },
  //     results: news.map((news) => ({
  //       id: news.news_id,
  //       author: news.author,
  //       categories: news.categories
  //         ? news.categories
  //             .filter(Boolean)
  //             .map((category: string) => category.trim())
  //         : [],
  //       scheduled_at: news.scheduled_at,
  //       content: news.content,
  //       create_at: news.create_at,
  //       description: news.description.trim(),
  //       excerpt: news.excerpt.trim(),
  //       news_status: news.news_status?.trim(),
  //       slug: news.slug?.trim(),
  //       title: news.title.trim(),
  //       visibility: news.visibility?.trim(),
  //       feature_image: news.feature_image?.trim(),
  //     })),
  //   };
  // }

  async getCustomNews(
    query: any,
    current: number,
    pageSize: number,
    search?: string,
  ): Promise<any> {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;

    if (!current) current = 1;
    if (!pageSize) pageSize = 6;

    // Create a query builder for counting and filtering
    const queryBuilder = this.newsRepository.createQueryBuilder('news');

    // Apply search filter if provided
    if (search) {
      queryBuilder.where(
        '(news.title ILIKE :search OR news.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply other filters from query params
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((key) => {
        if (key === 'news_status') {
          queryBuilder.andWhere(`news.${key} = :${key}`, {
            [key]: filter[key],
          });
        }
      });
    }

    // Count total items for pagination
    const totalItems = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip((current - 1) * pageSize).take(pageSize);

    // Apply sorting
    if (sort) {
      const sortField = Object.keys(sort)[0];
      const sortOrder = sort[sortField] === 1 ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`news.${sortField}`, sortOrder as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('news.create_at', 'DESC');
    }

    // Get news IDs from the filtered query
    const newsIds = await queryBuilder
      .select('news.id')
      .getMany()
      .then((news) => news.map((a) => a.id));

    if (newsIds.length === 0) {
      return {
        meta: {
          current,
          pageSize,
          pages: 0,
          total: 0,
        },
        results: [],
      };
    }

    // Get detailed news data with joins
    const newsQuery = this.newsRepository
      .createQueryBuilder('news')
      .leftJoin('users', 'user', 'user.id = news.author_id')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(news.categories_id)',
      )
      .select([
        'news.id AS news_id',
        'user.username AS author',
        'news.content AS content',
        'news.create_at AS create_at',
        'news.description AS description',
        'news.excerpt AS excerpt',
        'news.news_status AS news_status',
        'news.visibility AS visibility',
        'news.scheduled_at AS scheduled_at',
        'news.slug AS slug',
        'news.title AS title',
        'news.feature_image AS feature_image',
        // Sử dụng json_agg để tạo mảng object cho categories
        "json_agg(json_build_object('id', category.id, 'name', TRIM(category.name))) AS categories",
      ])
      .where('news.id IN (:...newsIds)', { newsIds })
      .groupBy('news.id, user.username');

    const news = await newsQuery.getRawMany();

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results: news.map((news) => ({
        id: news.news_id,
        author: news.author,
        categories: news.categories
          ? news.categories.filter((cat: any) => cat !== null) // Loại bỏ các giá trị null
          : [], // Trả về mảng rỗng nếu không có categories
        scheduled_at: news.scheduled_at,
        content: news.content,
        create_at: news.create_at,
        description: news.description?.trim(),
        excerpt: news.excerpt?.trim(),
        news_status: news.news_status?.trim(),
        slug: news.slug?.trim(),
        title: news.title.trim(),
        visibility: news.visibility?.trim(),
        feature_image: news.feature_image?.trim(),
      })),
    };
  }

  async getCustomNewsByCategory(
    search: string | undefined,
    current: number,
    pageSize: number,
    id?: string, // category_id là tùy chọn
  ) {
    const { filter, sort } = aqp(search);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 6;

    // Subquery để lấy danh sách bài viết phân trang
    const subQueryBuilder = this.newsRepository
      .createQueryBuilder('news')
      .select('news.id')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(news.categories_id)',
      )
      .where(filter);

    if (id) {
      subQueryBuilder.andWhere(':id = ANY(news.categories_id)', { id });
    }

    subQueryBuilder
      .orderBy(sort as any)
      .skip((current - 1) * pageSize)
      .take(pageSize);
    // .limit(pageSize);

    // Lấy danh sách ID từ subquery
    const subQueryResult = await subQueryBuilder.getRawMany();
    const newsIds = subQueryResult.map((result) => result.news_id);
    console.debug('>>> News IDs from Subquery:', newsIds);

    if (newsIds.length === 0) {
      console.debug('>>> No news found in subquery');
      return {
        meta: {
          current,
          pageSize,
          pages: 0,
          total: 0,
        },
        results: [],
      };
    }

    // Query chính để lấy dữ liệu chi tiết (thêm GROUP BY)
    const newsQuery = this.newsRepository
      .createQueryBuilder('news')
      .leftJoin('users', 'user', 'user.id = news.author_id')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(news.categories_id)',
      )
      .select([
        'news.id',
        'user.username AS author',
        'news.content AS content',
        'news.create_at AS create_at',
        'news.description AS description',
        'news.excerpt AS excerpt',
        'news.news_status AS news_status',
        'news.visibility AS visibility',
        'news.slug AS slug',
        'news.title AS title',
        'news.feature_image AS feature_image',
        'ARRAY_AGG(category.name) AS categories', // Vẫn lấy danh sách danh mục
      ])
      .where('news.id IN (:...newsIds)', { newsIds })
      .groupBy('news.id')
      .addGroupBy('user.username') // Thêm các cột khác nếu cần
      .addGroupBy('news.content')
      .addGroupBy('news.create_at')
      .addGroupBy('news.description')
      .addGroupBy('news.excerpt')
      .addGroupBy('news.news_status')
      .addGroupBy('news.visibility')
      .addGroupBy('news.slug')
      .addGroupBy('news.title')
      .addGroupBy('news.feature_image');

    const news = await newsQuery.getRawMany();

    // Đếm tổng số bản ghi
    const totalItemsQuery = this.newsRepository
      .createQueryBuilder('news')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(news.categories_id)',
      )
      .where(filter);

    if (id) {
      totalItemsQuery.andWhere(':id = ANY(news.categories_id)', { id });
    }

    const totalItems = await totalItemsQuery.getCount();

    console.debug('>>> Total News:', totalItems);
    console.debug('>>> News length:', news.length);
    console.debug('>>> News:', news);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results: news.map((news) => ({
        id: news.id,
        author: news.author,
        categories: news.categories
          ? news.categories
              .filter(Boolean)
              .map((category: string) => category.trim())
          : [],
        content: news.content,
        create_at: news.create_at,
        description: news.description,
        excerpt: news.excerpt,
        news_status: news.news_status?.trim(),
        slug: news.slug?.trim(),
        title: news.title,
        visibility: news.visibility?.trim(),
        feature_image: news.feature_image?.trim(),
      })),
    };
  }

  async getCustomNewsBySlug(slug: string): Promise<NewsResponseDto | null> {
    const news = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoin('users', 'user', 'user.id = news.author_id') // Join với user
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(news.categories_id)',
      )
      .leftJoin('news_tags', 'news_tag', 'news_tag.id = ANY(news.tags_id)')
      .select([
        'news.id',
        'user.username AS author',
        'news.content AS content',
        'news.create_at AS create_at',
        'news.description AS description',
        'news.excerpt AS excerpt',
        'news.scheduled_at AS scheduled_at',
        'news.news_status AS news_status',
        'news.visibility AS visibility',
        'news.blocks_data AS blocks_data',
        'news.slug AS slug',
        'news.title AS title',
        'news.feature_image as feature_image',
        'ARRAY_AGG(DISTINCT category.name) AS categories',
        'ARRAY_AGG(DISTINCT news_tag.name) AS tags',
      ])
      .where('news.slug = :slug', { slug }) // Lọc theo slug
      .groupBy('news.id, user.username') // Group data
      .getRawOne(); // Lấy 1 bài viết duy nhất

    if (!news) return null; // Nếu không tìm thấy, trả về null

    // Format lại dữ liệu
    return {
      id: news.news_id,
      author: news.author,
      categories: news.categories
        ? news.categories
            .filter(Boolean)
            .map((category: string) => category.trim()) // Filter non-null categories and trim
        : [],
      tags: news.tags
        ? news.tags.filter(Boolean).map((tag: string) => tag.trim()) // Filter non-null categories and trim
        : [],
      content: news.content,
      create_at: news.create_at, // Convert timezone
      description: news.description,
      excerpt: news.excerpt,
      news_status: news.news_status?.trim(), // Remove whitespace
      slug: news.slug?.trim(),
      title: news.title,
      visibility: news.visibility?.trim(),
      feature_image: news.feature_image?.trim(),
      scheduled_at: news.scheduled_at,
      blocks_data: news.blocks_data,
    };
  }

  async getCustomNewstById(id: string): Promise<any> {
    const news = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoin('users', 'user', 'user.id = news.author_id') // Join với user
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(news.categories_id)',
      ) // Join với category
      .leftJoin('news_tags', 'news_tag', 'news_tag.id = ANY(news.tags_id)')
      .select([
        'news.id',
        'user.username AS author',
        'news.content AS content',
        'news.create_at AS create_at',
        'news.description AS description',
        'news.excerpt AS excerpt',
        'news.scheduled_at AS scheduled_at',
        'news.news_status AS news_status',
        'news.visibility AS visibility',
        'news.slug AS slug',
        'news.title AS title',
        'news.categories_id AS categories_id',
        'news.tags_id AS tags_id',
        'news.feature_image as feature_image',
        'ARRAY_AGG(DISTINCT category.name) AS categories',
        'ARRAY_AGG(DISTINCT news_tag.name) AS tags',
      ])
      .where('news.id = :id', { id }) // Lọc theo slug
      .groupBy('news.id, user.username') // Group data
      .getRawOne(); // Lấy 1 bài viết duy nhất

    if (!news) return null; // Nếu không tìm thấy, trả về null

    // Format lại dữ liệu
    return {
      id: news.news_id,
      author: news.author,
      categories: news.categories
        ? news.categories
            .filter(Boolean)
            .map((category: string) => category.trim()) // Filter non-null categories and trim
        : [],
      tags: news.tags
        ? news.tags.filter(Boolean).map((tag: string) => tag.trim()) // Filter non-null categories and trim
        : [],
      content: news.content,
      create_at: news.create_at, // Convert timezone
      description: news.description,
      excerpt: news.excerpt,
      news_status: news.news_status?.trim(), // Remove whitespace
      slug: news.slug?.trim(),
      title: news.title,
      visibility: news.visibility?.trim(),
      feature_image: news.feature_image?.trim(),
      scheduled_at: news.scheduled_at,
      categories_id: news.categories_id,
      tags_id: news.tags_id,
    };
  }

  async uploadImageNews(id: string, file: string) {
    return await this.newsRepository.update(id, { feature_image: file });
  }

  async updateNewsById(updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepository.findOne({
      where: { id: updateNewsDto.id },
    });
    if (!news) {
      throw new BadRequestException('News không tồn tại');
    }
    const updatedNews = {
      ...news,
      ...updateNewsDto,
    };
    return await this.newsRepository.save(updatedNews);
  }

  async deleteById(id: string) {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new BadRequestException('News không tồn tại');
    }
    return await this.newsRepository.remove(news);
  }
}
