import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, type Repository } from 'typeorm';
import type { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';
import { Post } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostResponseDto } from './dto/response-post.dto';
import { UserEntity } from '../users/entities/users.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import aqp from 'api-query-params';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    // mongodb
    @InjectModel(Post.name) private postModel: Model<Post>,

    // postgres
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll() {
    return this.postRepository.find();
  }

  async findOne(id: string): Promise<PostEntity> {
    return this.postRepository.findOne({ where: { id } });
  }

  async removePostById(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException('Post không tồn tại');
    }
    return await this.postRepository.remove(post);
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


  async create(createPostDto: CreatePostDto) {
    try {
      const {
        title,
        content,
        blocks_data, // Đã là object, không cần JSON.parse
        description,
        excerpt,
        post_status,
        slug,
        categories_id,
        tags_id,
        author_id,
        visibility,
        comment_status,
        ping_status,
        feature_image,
        scheduled_at,
        create_at,
      } = createPostDto;

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
      const existingPost = await this.postRepository.findOne({
        where: { slug: finalSlug },
      });
      if (existingPost) {
        throw new ConflictException('A post with this slug already exists');
      }

      // Create new post
      const newPost = this.postRepository.create({
        title,
        content,
        blocks_data, // Lưu trực tiếp dưới dạng object, PostgreSQL sẽ tự chuyển thành JSONB
        description,
        excerpt,
        post_status,
        slug,
        categories_id: formattedCategories,
        tags_id: formattedTags,
        visibility,
        comment_status,
        ping_status,
        author_id,
        feature_image,
        scheduled_at,
        create_at,
      });

      return await this.postRepository.save(newPost);
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async getEachPost() {
    const query = `
         WITH category_post_count AS (
            SELECT 
                c.id,
                c.name, 
                COUNT(p.id) AS count
            FROM demo.categories c
            LEFT JOIN demo.posts p ON c.id = ANY(p.categories_id)
            GROUP BY c.id, c.name
            HAVING COUNT(p.id) > 0
        ),
        total_count AS (
            SELECT SUM(count) AS count FROM category_post_count
        )
        SELECT id, name, count FROM category_post_count
        UNION ALL
        SELECT NULL AS id, 'All' AS name, (SELECT count FROM total_count) AS count
        ORDER BY count DESC;
    `;

    try {
      const result = await this.postRepository.query(query);
      console.log('Raw result:', result); // Debug để kiểm tra dữ liệu
      return result.map((row) => ({
        id: row.id, // Thêm id vào kết quả
        name: row.name,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error('Error fetching post counts:', error);
      throw error;
    }
  }

  async getPostBySlug(slug: string) {
    return this.postRepository.findOne({ where: { slug } });
  }

  // async getCustomPosts(query: string, current: number, pageSize: number) {
  //   const { filter, sort } = aqp(query);

  //   if (filter.current) delete filter.current;
  //   if (filter.pageSize) delete filter.pageSize;

  //   if (!current) current = 1;
  //   if (!pageSize) pageSize = 6;

  //   // Subquery để lấy danh sách bài viết phân trang
  //   const subQuery = this.postRepository
  //     .createQueryBuilder('post')
  //     .select('post.id')
  //     .where(filter)
  //     .orderBy(sort as any)
  //     .skip((current - 1) * pageSize)
  //     .take(pageSize)
  //     .getQuery();

  //   // Query chính để lấy dữ liệu chi tiết
  //   const postsQuery = this.postRepository
  //     .createQueryBuilder('post')
  //     .leftJoin('users', 'user', 'user.id = post.author_id')
  //     .leftJoin(
  //       'categories',
  //       'category',
  //       'category.id = ANY(post.categories_id)',
  //     )
  //     .select([
  //       'post.id',
  //       'user.username AS author',
  //       'post.content AS content',
  //       'post.create_at AS create_at',
  //       'post.description AS description',
  //       'post.excerpt AS excerpt',
  //       'post.comment_status AS comment_status',
  //       'post.ping_status AS ping_status',
  //       'post.post_status AS post_status',
  //       'post.visibility AS visibility',
  //       'post.scheduled_at AS scheduled_at',
  //       'post.slug AS slug',
  //       'post.title AS title',
  //       'post.feature_image AS feature_image',
  //       'ARRAY_AGG(category.name) AS categories',
  //     ])
  //     .where(`post.id IN (${subQuery})`)
  //     .groupBy('post.id, user.username');

  //   const posts = await postsQuery.getRawMany();

  //   // Đếm tổng số bản ghi
  //   const totalItems = await this.postRepository
  //     .createQueryBuilder('post')
  //     .where(filter)
  //     .getCount();

  //   console.debug('>>> Total Posts:', totalItems);
  //   console.debug('>>> Posts length:', posts.length);
  //   console.debug('>>> Posts:', posts);

  //   const totalPages = Math.ceil(totalItems / pageSize);

  //   return {
  //     meta: {
  //       current,
  //       pageSize,
  //       pages: totalPages,
  //       total: totalItems,
  //     },
  //     results: posts.map((post) => ({
  //       id: post.post_id,
  //       author: post.author,
  //       categories: post.categories
  //         ? post.categories
  //             .filter(Boolean)
  //             .map((category: string) => category.trim())
  //         : [],
  //       comment_status: post.comment_status,
  //       scheduled_at: post.scheduled_at,
  //       content: post.content,
  //       create_at: post.create_at,
  //       description: post.description,
  //       excerpt: post.excerpt,
  //       ping_status: post.ping_status,
  //       post_status: post.post_status?.trim(),
  //       slug: post.slug?.trim(),
  //       title: post.title,
  //       visibility: post.visibility?.trim(),
  //       feature_image: post.feature_image?.trim(),
  //     })),
  //   };
  // }

  async getCustomPosts(
    query: any,
    current: number,
    pageSize: number,
    search?: string,
  ) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;

    if (!current) current = 1;
    if (!pageSize) pageSize = 6;

    // Create a query builder
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    // Apply search filter if provided
    if (search) {
      queryBuilder.where(
        '(post.title ILIKE :search OR post.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply other filters from query params
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((key) => {
        if (key === 'post_status') {
          queryBuilder.andWhere(`post.${key} = :${key}`, {
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
      queryBuilder.orderBy(`post.${sortField}`, sortOrder as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('post.create_at', 'DESC');
    }

    // Get post IDs from the filtered query
    const postIds = await queryBuilder
      .select('post.id')
      .getMany()
      .then((posts) => posts.map((post) => post.id));

    if (postIds.length === 0) {
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

    // Get detailed post data with joins
    const postsQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('users', 'user', 'user.id = post.author_id')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(post.categories_id)',
      )
      .select([
        'post.id',
        'user.username AS author',
        'post.content AS content',
        'post.create_at AS create_at',
        'post.description AS description',
        'post.excerpt AS excerpt',
        'post.comment_status AS comment_status',
        'post.ping_status AS ping_status',
        'post.post_status AS post_status',
        'post.visibility AS visibility',
        'post.scheduled_at AS scheduled_at',
        'post.slug AS slug',
        'post.title AS title',
        'post.feature_image AS feature_image',
        'ARRAY_AGG(category.name) AS categories',
      ])
      .where('post.id IN (:...postIds)', { postIds })
      .groupBy('post.id, user.username');

    const posts = await postsQuery.getRawMany();

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results: posts.map((post) => ({
        id: post.post_id,
        author: post.author,
        categories: post.categories
          ? post.categories
              .filter(Boolean)
              .map((category: string) => category.trim())
          : [],
        comment_status: post.comment_status,
        scheduled_at: post.scheduled_at,
        content: post.content,
        create_at: post.create_at,
        description: post.description,
        excerpt: post.excerpt,
        ping_status: post.ping_status,
        post_status: post.post_status?.trim(),
        slug: post.slug?.trim(),
        title: post.title,
        visibility: post.visibility?.trim(),
        feature_image: post.feature_image?.trim(),
      })),
    };
  }


  // should merge with getCustomPosts
  async getCustomPostByCategory(
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
    const subQueryBuilder = this.postRepository
      .createQueryBuilder('post')
      .select('post.id')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(post.categories_id)',
      )
      .where(filter);

    if (id) {
      subQueryBuilder.andWhere(':id = ANY(post.categories_id)', { id });
    }

    subQueryBuilder
      .orderBy(sort as any)
      .skip((current - 1) * pageSize)
      .take(pageSize);
    // .limit(pageSize);

    // Lấy danh sách ID từ subquery
    const subQueryResult = await subQueryBuilder.getRawMany();
    const postIds = subQueryResult.map((result) => result.post_id);
    console.debug('>>> Post IDs from Subquery:', postIds);

    if (postIds.length === 0) {
      console.debug('>>> No posts found in subquery');
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
    const postsQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('users', 'user', 'user.id = post.author_id')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(post.categories_id)',
      )
      .select([
        'post.id',
        'user.username AS author',
        'post.content AS content',
        'post.create_at AS create_at',
        'post.description AS description',
        'post.excerpt AS excerpt',
        'post.comment_status AS comment_status',
        'post.ping_status AS ping_status',
        'post.post_status AS post_status',
        'post.visibility AS visibility',
        'post.slug AS slug',
        'post.title AS title',
        'post.feature_image AS feature_image',
        'ARRAY_AGG(category.name) AS categories', // Vẫn lấy danh sách danh mục
      ])
      .where('post.id IN (:...postIds)', { postIds })
      .groupBy('post.id') // Thêm GROUP BY theo post.id
      .addGroupBy('user.username') // Thêm các cột khác nếu cần
      .addGroupBy('post.content')
      .addGroupBy('post.create_at')
      .addGroupBy('post.description')
      .addGroupBy('post.excerpt')
      .addGroupBy('post.comment_status')
      .addGroupBy('post.ping_status')
      .addGroupBy('post.post_status')
      .addGroupBy('post.visibility')
      .addGroupBy('post.slug')
      .addGroupBy('post.title')
      .addGroupBy('post.feature_image');

    const posts = await postsQuery.getRawMany();

    // Đếm tổng số bản ghi
    const totalItemsQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(post.categories_id)',
      )
      .where(filter);

    if (id) {
      totalItemsQuery.andWhere(':id = ANY(post.categories_id)', { id });
    }

    const totalItems = await totalItemsQuery.getCount();

    console.debug('>>> Total Posts:', totalItems);
    console.debug('>>> Posts length:', posts.length);
    console.debug('>>> Posts:', posts);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results: posts.map((post) => ({
        id: post.id,
        author: post.author,
        categories: post.categories
          ? post.categories
              .filter(Boolean)
              .map((category: string) => category.trim())
          : [],
        comment_status: post.comment_status,
        content: post.content,
        create_at: post.create_at,
        description: post.description,
        excerpt: post.excerpt,
        ping_status: post.ping_status,
        post_status: post.post_status?.trim(),
        slug: post.slug?.trim(),
        title: post.title,
        visibility: post.visibility?.trim(),
        feature_image: post.feature_image?.trim(),
      })),
    };
  }

  // async getCustomPostByCategory(
  //   search: string | undefined,
  //   current: number,
  //   pageSize: number,
  //   id?: string, // category_id là tùy chọn
  // ) {
  //   const { filter, sort } = aqp(search);

  //   if (filter.current) delete filter.current;
  //   if (filter.pageSize) delete filter.pageSize;

  //   console.debug('>>> Filter condition:', filter);

  //   if (!current) current = 1;
  //   if (!pageSize) pageSize = 6;

  //   // Subquery để lấy danh sách ID đã phân trang
  //   const subQueryBuilder = this.postRepository
  //     .createQueryBuilder('post')
  //     .select('post.id')
  //     .leftJoin(
  //       'categories',
  //       'category',
  //       'category.id = ANY(post.categories_id)',
  //     )
  //     .where(filter);

  //   if (id) {
  //     subQueryBuilder.andWhere(':id = ANY(post.categories_id)', { id });
  //   }

  //   subQueryBuilder
  //     .orderBy('post.id', 'DESC')
  //     .offset((current - 1) * pageSize) // Bắt đầu từ vị trí tương ứng trang
  //     .limit(pageSize);

  //   const subQueryResult = await subQueryBuilder
  //     .select('post.id AS id')
  //     .getRawMany();
  //   const postIds = subQueryResult.map((result) => result.id);
  //   console.debug('>>> Post IDs from Subquery:', postIds);

  //   console.debug('>>> Subquery Raw Result:', subQueryResult);
  //   console.debug('>>> Post IDs length:', postIds.length);

  //   if (postIds.length === 0) {
  //     console.debug('>>> No posts found in subquery');
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

  //   if (postIds.length === 0) {
  //     return {
  //       meta: { current, pageSize, pages: 0, total: 0 },
  //       results: [],
  //     };
  //   }

  //   // Query chính để lấy chi tiết bài viết
  //   const postsQuery = this.postRepository
  //     .createQueryBuilder('post')
  //     .leftJoin('users', 'user', 'user.id = post.author_id')
  //     .leftJoin(
  //       'categories',
  //       'category',
  //       'category.id = ANY(post.categories_id)',
  //     )
  //     .select([
  //       'post.id',
  //       'user.username AS author',
  //       'post.content AS content',
  //       'post.create_at AS create_at',
  //       'post.description AS description',
  //       'post.excerpt AS excerpt',
  //       'post.comment_status AS comment_status',
  //       'post.ping_status AS ping_status',
  //       'post.post_status AS post_status',
  //       'post.visibility AS visibility',
  //       'post.slug AS slug',
  //       'post.title AS title',
  //       'post.feature_image AS feature_image',
  //       'ARRAY_AGG(category.name) AS categories',
  //     ])
  //     .where('post.id IN (:...postIds)', { postIds })
  //     .groupBy('post.id')
  //     .addGroupBy('user.username')
  //     .addGroupBy('post.content')
  //     .addGroupBy('post.create_at')
  //     .addGroupBy('post.description')
  //     .addGroupBy('post.excerpt')
  //     .addGroupBy('post.comment_status')
  //     .addGroupBy('post.ping_status')
  //     .addGroupBy('post.post_status')
  //     .addGroupBy('post.visibility')
  //     .addGroupBy('post.slug')
  //     .addGroupBy('post.title')
  //     .addGroupBy('post.feature_image');

  //   const posts = await postsQuery.getRawMany();

  //   // Đếm tổng số bản ghi
  //   const totalItemsQuery = this.postRepository
  //     .createQueryBuilder('post')
  //     .leftJoin(
  //       'categories',
  //       'category',
  //       'category.id = ANY(post.categories_id)',
  //     )
  //     .where(filter);

  //   if (id) {
  //     totalItemsQuery.andWhere(':id = ANY(post.categories_id)', { id });
  //   }

  //   const totalItems = await totalItemsQuery.getCount();

  //   // console.debug('>>> Total Posts:', totalItems);
  //   // console.debug('>>> Posts length:', posts.length);
  //   // console.debug('>>> Posts:', posts);

  //   const totalPages = Math.ceil(totalItems / pageSize);

  //   return {
  //     meta: {
  //       current,
  //       pageSize,
  //       pages: totalPages,
  //       total: totalItems,
  //     },
  //     results: posts.map((post) => ({
  //       id: post.id,
  //       author: post.author,
  //       categories: post.categories
  //         ? post.categories
  //             .filter(Boolean)
  //             .map((category: string) => category.trim())
  //         : [],
  //       comment_status: post.comment_status,
  //       content: post.content,
  //       create_at: post.create_at,
  //       description: post.description,
  //       excerpt: post.excerpt,
  //       ping_status: post.ping_status,
  //       post_status: post.post_status?.trim(),
  //       slug: post.slug?.trim(),
  //       title: post.title,
  //       visibility: post.visibility?.trim(),
  //       feature_image: post.feature_image?.trim(),
  //     })),
  //   };
  // }

  async getCustomPostBySlug(slug: string): Promise<PostResponseDto | null> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('users', 'user', 'user.id = post.author_id') // Join với user
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(post.categories_id)',
      ) // Join với category
      .leftJoin('post_tags', 'post_tag', 'post_tag.id = ANY(post.tags_id)') // Join với post_tags
      .select([
        'post.id',
        'user.username AS author',
        'post.content AS content',
        'post.create_at AS create_at',
        'post.description AS description',
        'post.excerpt AS excerpt',
        'post.comment_status AS comment_status',
        'post.ping_status AS ping_status',
        'post.scheduled_at AS scheduled_at',
        'post.post_status AS post_status',
        'post.visibility AS visibility',
        'post.blocks_data AS blocks_data',
        'post.slug AS slug',
        'post.title AS title',
        'post.feature_image as feature_image',
        'ARRAY_AGG(DISTINCT category.name) AS categories',
        'ARRAY_AGG(DISTINCT post_tag.name) AS tags',
      ])
      .where('post.slug = :slug', { slug }) // Lọc theo slug
      .groupBy('post.id, user.username') // Group data
      .getRawOne(); // Lấy 1 bài viết duy nhất

    if (!post) return null; // Nếu không tìm thấy, trả về null

    // Format lại dữ liệu
    return {
      id: post.post_id,
      author: post.author,
      categories: post.categories
        ? post.categories
            .filter(Boolean)
            .map((category: string) => category.trim()) // Filter non-null categories and trim
        : [],
      tags: post.tags
        ? post.tags.filter(Boolean).map((tag: string) => tag.trim()) // Filter non-null categories and trim
        : [],
      comment_status: post.comment_status,
      content: post.content,
      create_at: post.create_at, // Convert timezone
      description: post.description,
      excerpt: post.excerpt,
      ping_status: post.ping_status,
      post_status: post.post_status?.trim(), // Remove whitespace
      slug: post.slug?.trim(),
      title: post.title,
      visibility: post.visibility?.trim(),
      feature_image: post.feature_image?.trim(),
      scheduled_at: post.scheduled_at,
      blocks_data: post.blocks_data,
    };
  }

  async getCustomPostById(id: string): Promise<any> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('users', 'user', 'user.id = post.author_id') // Join với user
      .leftJoin(
        'categories',
        'category',
        'category.id = ANY(post.categories_id)',
      ) // Join với category
      .leftJoin('post_tags', 'post_tag', 'post_tag.id = ANY(post.tags_id)') // Join với post_tags
      .select([
        'post.id',
        'user.username AS author',
        'post.content AS content',
        'post.create_at AS create_at',
        'post.description AS description',
        'post.excerpt AS excerpt',
        'post.comment_status AS comment_status',
        'post.ping_status AS ping_status',
        'post.scheduled_at AS scheduled_at',
        'post.post_status AS post_status',
        'post.visibility AS visibility',
        'post.slug AS slug',
        'post.title AS title',
        'post.categories_id AS categories_id',
        'post.tags_id AS tags_id',
        'post.feature_image as feature_image',
        'ARRAY_AGG(DISTINCT category.name) AS categories',
        'ARRAY_AGG(DISTINCT post_tag.name) AS tags',
      ])
      .where('post.id = :id', { id }) // Lọc theo slug
      .groupBy('post.id, user.username') // Group data
      .getRawOne(); // Lấy 1 bài viết duy nhất

    if (!post) return null; // Nếu không tìm thấy, trả về null

    // Format lại dữ liệu
    return {
      id: post.post_id,
      author: post.author,
      categories: post.categories
        ? post.categories
            .filter(Boolean)
            .map((category: string) => category.trim()) // Filter non-null categories and trim
        : [],
      tags: post.tags
        ? post.tags.filter(Boolean).map((tag: string) => tag.trim()) // Filter non-null categories and trim
        : [],
      comment_status: post.comment_status,
      content: post.content,
      create_at: post.create_at, // Convert timezone
      description: post.description,
      excerpt: post.excerpt,
      ping_status: post.ping_status,
      post_status: post.post_status?.trim(), // Remove whitespace
      slug: post.slug?.trim(),
      title: post.title,
      visibility: post.visibility?.trim(),
      feature_image: post.feature_image?.trim(),
      scheduled_at: post.scheduled_at,
      categories_id: post.categories_id,
      tags_id: post.tags_id,
    };
  }

  async uploadImagePost(id: string, file: string) {
    return await this.postRepository.update(id, { feature_image: file });
  }

  async updatePostById(updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id: updatePostDto.id },
    });
    if (!post) {
      throw new BadRequestException('Post không tồn tại');
    }
    const updatedPost = {
      ...post,
      ...updatePostDto,
    };
    return await this.postRepository.save(updatedPost);
  }

  async deleteById(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException('Post không tồn tại');
    }
    return await this.postRepository.remove(post);
  }
}
