import { Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post_comment.dto';
import { UpdatePostCommentDto } from './dto/update-post_comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostComment } from './schema/post_comment.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PostCommentEntity } from './entities/post_comment.entity';
import { UserEntity } from '../users/entities/users.entity';
import { PostCommentLikeEntity } from '../post_comments_likes/entities/post_comments_like.entity';
import aqp from 'api-query-params';

// @Injectable()
// export class PostCommentsService {
//   constructor(
//     // mongodb
//     @InjectModel(PostComment.name)
//     private postCommentsModel: Model<PostComment>,

//     // postgres
//     @InjectRepository(PostCommentEntity)
//     private readonly postCommentRepository: Repository<PostCommentEntity>,
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//     @InjectRepository(PostCommentLikeEntity)
//     private postCommentsLikesRepository: Repository<PostCommentLikeEntity>,
//   ) {}

//   async   create(
//     createPostCommentDto: CreatePostCommentDto,
//   ): Promise<PostCommentEntity> {
//     const { user_id, post_id, parent_id, content} = createPostCommentDto;

//     // Kiểm tra xem user_id có tồn tại không (tùy chọn)
//     const user = await this.userRepository.findOne({ where: { id: user_id } });
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Xác định status dựa trên role_id
//     const status = user.role_id === 1 ? 'approved' : 'pending';

//     // Tạo mới comment
//     const newComment = this.postCommentRepository.create({
//       user_id,
//       post_id,
//       parent_id: parent_id || null, // Nếu không có parent_id thì set là null
//       content,
//       status,
//     });

//     // Lưu vào database
//     return this.postCommentRepository.save(newComment);
//   }

//   findAll() {
//     return this.postCommentRepository.find();
//   }

//   findOne(id: string) {
//     return this.postCommentRepository.findOne({ where: { id } });
//   }

//   // async getCommentsByPostId(id: string) {
//   //   const posts = await this.postCommentRepository.find({
//   //     where: { post_id: id },
//   //   });
//   //   return posts;
//   // }

//   async getCommentsByPostId(postId: string): Promise<any[]> {
//     // Lấy tất cả comment gốc (không có parent_id) của bài post
//     const rootComments = await this.postCommentRepository.find({
//       where: { post_id: postId, parent_id: IsNull() },
//       order: { created_at: 'ASC' },
//     });

//     // Hàm đệ quy để xây dựng cây comment
//     const buildCommentTree = async (
//       comment: PostCommentEntity,
//     ): Promise<any> => {
//       // Lấy thông tin tác giả từ UserEntity
//       const user = await this.userRepository.findOne({
//         where: { id: comment.user_id },
//       });

//       // Đếm số lượt like từ PostCommentLikeEntity
//       const likeCount = await this.postCommentsLikesRepository.count({
//         where: { post_comment_id: comment.id },
//       });

//       // Lấy các reply (comment con)
//       const replies = await this.postCommentRepository.find({
//         where: { parent_id: comment.id },
//         order: { created_at: 'ASC' },
//       });

//       return {
//         id: comment.id,
//         author: user?.username || 'Anonymous', // Tên tác giả từ full_name
//         date: comment.created_at.toISOString().split('T')[0], // Format YYYY-MM-DD
//         content: comment.content,
//         likes: likeCount,
//         status: comment.status,
//         user_id: comment.user_id,
//         replies: await Promise.all(replies.map(buildCommentTree)), // Đệ quy lấy replies
//       };
//     };

//     // Format toàn bộ danh sách comment
//     const formattedComments = await Promise.all(
//       rootComments.map(buildCommentTree),
//     );
//     return formattedComments;
//   }

//   async update(id: string, updatePostCommentDto: UpdatePostCommentDto) {
//     const comment = await this.postCommentRepository.findOne({ where: { id } });
//     if (!comment) {
//       throw new Error('Comment not found');
//     }

//     // Update comment fields
//     Object.assign(comment, updatePostCommentDto);

//     // Save updated comment
//     return this.postCommentRepository.save(comment);
//   }

//   async remove(id: string) {
//     const comment = await this.postCommentRepository.findOne({ where: { id } });
//     if (!comment) {
//       throw new Error('Comment not found');
//     }

//     return this.postCommentRepository.remove(comment);
//   }

//   async getPendingComments(
//     query: any,
//     current: number,
//     pageSize: number,
//   ): Promise<{ meta: any; results: any[] }> {
//     const { filter, sort } = aqp(query);

//     // Xóa các trường không cần thiết từ filter
//     if (filter.current) delete filter.current;
//     if (filter.pageSize) delete filter.pageSize;
//     if (filter.search) delete filter.search;

//     // Mặc định nếu không truyền current hoặc pageSize
//     if (!current) current = 1;
//     if (!pageSize) pageSize = 10;

//     // Tính skip (số bản ghi cần bỏ qua) và take (số bản ghi lấy)
//     const skip = (current - 1) * pageSize;
//     const take = pageSize;

//     // Đếm tổng số comment pending để tính totalItems
//     const totalItems = await this.postCommentRepository.count({
//       where: { status: 'pending' },
//     });

//     // Tính tổng số trang
//     const totalPages = Math.ceil(totalItems / pageSize);

//     // Lấy danh sách comment pending với phân trang
//     const pendingComments = await this.postCommentRepository.find({
//       where: { status: 'pending' },
//       order: { created_at: 'ASC' }, // Có thể dùng sort từ query nếu cần
//       skip,
//       take,
//     });

//     // Lấy thông tin user cho từng comment
//     const comments = await Promise.all(
//       pendingComments.map(async (comment) => {
//         const user = await this.userRepository.findOne({
//           where: { id: comment.user_id },
//         });

//         return {
//           id: comment.id,
//           post_id: comment.post_id,
//           user_id: comment.user_id,
//           content: comment.content,
//           status: comment.status,
//           created_at: comment.created_at.toISOString().split('T')[0],
//           author: user?.username || 'Anonymous',
//         };
//       }),
//     );

//     // Trả về response với meta và results
//     return {
//       meta: {
//         current,
//         pageSize,
//         pages: totalPages,
//         total: totalItems,
//       },
//       results: comments,
//     };
//   }
// }


@Injectable()
export class PostCommentsService {
  constructor(
    // mongodb
    @InjectModel(PostComment.name)
    private postCommentsModel: Model<PostComment>,

    // postgres
    @InjectRepository(PostCommentEntity)
    private readonly postCommentRepository: Repository<PostCommentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostCommentLikeEntity)
    private postCommentsLikesRepository: Repository<PostCommentLikeEntity>,
  ) {}

  async create(createPostCommentDto: CreatePostCommentDto): Promise<PostCommentEntity> {
    const { user_id, post_id, parent_id, content } = createPostCommentDto

    // Kiểm tra xem user_id có tồn tại không (tùy chọn)
    const user = await this.userRepository.findOne({ where: { id: user_id } })
    if (!user) {
      throw new Error("User not found")
    }

    // Xác định status dựa trên role_id
    const status = user.role_id === 1 ? "approved" : "pending"

    // Tạo mới comment
    const newComment = this.postCommentRepository.create({
      user_id,
      post_id,
      parent_id: parent_id || null, // Nếu không có parent_id thì set là null
      content,
      status,
    })

    // Lưu vào database
    return this.postCommentRepository.save(newComment)
  }

  findAll() {
    return this.postCommentRepository.find()
  }

  findOne(id: string) {
    return this.postCommentRepository.findOne({ where: { id } })
  }

  async getCommentsByPostId(postId: string): Promise<any[]> {
    // Lấy tất cả comment gốc (không có parent_id) của bài post
    const rootComments = await this.postCommentRepository.find({
      where: { post_id: postId, parent_id: IsNull() },
      order: { created_at: "ASC" },
    })

    // Hàm đệ quy để xây dựng cây comment
    const buildCommentTree = async (comment: PostCommentEntity): Promise<any> => {
      // Lấy thông tin tác giả từ UserEntity
      const user = await this.userRepository.findOne({
        where: { id: comment.user_id },
      })

      // Đếm số lượt like từ PostCommentLikeEntity
      const likeCount = await this.postCommentsLikesRepository.count({
        where: { post_comment_id: comment.id },
      })

      // Lấy các reply (comment con)
      const replies = await this.postCommentRepository.find({
        where: { parent_id: comment.id },
        order: { created_at: "ASC" },
      })

      return {
        id: comment.id,
        author: user?.username || "Anonymous", // Tên tác giả từ full_name
        date: comment.created_at.toISOString().split("T")[0], // Format YYYY-MM-DD
        content: comment.content,
        likes: likeCount,
        status: comment.status,
        user_id: comment.user_id,
        replies: await Promise.all(replies.map(buildCommentTree)), // Đệ quy lấy replies
      }
    }

    // Format toàn bộ danh sách comment
    const formattedComments = await Promise.all(rootComments.map(buildCommentTree))
    return formattedComments
  }

  async getRepliesByParentId(parentId: string): Promise<any[]> {
    // Get all replies for a specific parent comment
    const replies = await this.postCommentRepository.find({
      where: { parent_id: parentId },
      order: { created_at: "ASC" },
    })

    // Format the replies
    const formattedReplies = await Promise.all(
      replies.map(async (reply) => {
        // Get author information
        const user = await this.userRepository.findOne({
          where: { id: reply.user_id },
        })

        // Count likes
        const likeCount = await this.postCommentsLikesRepository.count({
          where: { post_comment_id: reply.id },
        })

        return {
          id: reply.id,
          author: user?.username || "Anonymous",
          date: reply.created_at.toISOString().split("T")[0],
          content: reply.content,
          likes: likeCount,
          user_id: reply.user_id,
          post_id: reply.post_id,
          parent_id: reply.parent_id,
          created_at: reply.created_at,
          status: reply.status,
        }
      }),
    )

    return formattedReplies
  }

  async update(id: string, updatePostCommentDto: UpdatePostCommentDto) {
    const comment = await this.postCommentRepository.findOne({ where: { id } })
    if (!comment) {
      throw new Error("Comment not found")
    }

    // Update comment fields
    Object.assign(comment, updatePostCommentDto)

    // Save updated comment
    return this.postCommentRepository.save(comment)
  }

  async remove(id: string, deleteReplies = false) {
    const comment = await this.postCommentRepository.findOne({ where: { id } })
    if (!comment) {
      throw new Error("Comment not found")
    }

    // If deleteReplies is true and this is a parent comment (no parent_id), delete all replies first
    if (deleteReplies && !comment.parent_id) {
      // Find all replies to this comment
      const replies = await this.postCommentRepository.find({
        where: { parent_id: id },
      })

      // Delete all replies
      if (replies.length > 0) {
        await this.postCommentRepository.remove(replies)
      }
    }

    // Delete the comment itself
    return this.postCommentRepository.remove(comment)
  }

  async getPendingComments(query: any, current: number, pageSize: number): Promise<{ meta: any; results: any[] }> {
    const { filter, sort } = aqp(query)

    // Xóa các trường không cần thiết từ filter
    if (filter.current) delete filter.current
    if (filter.pageSize) delete filter.pageSize
    if (filter.search) delete filter.search

    // Mặc định nếu không truyền current hoặc pageSize
    if (!current) current = 1
    if (!pageSize) pageSize = 10

    // Tính skip (số bản ghi cần bỏ qua) và take (số bản ghi lấy)
    const skip = (current - 1) * pageSize
    const take = pageSize

    // Đếm tổng số comment pending để tính totalItems
    const totalItems = await this.postCommentRepository.count({
      where: { status: "pending" },
    })

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / pageSize)

    // Lấy danh sách comment pending với phân trang
    const pendingComments = await this.postCommentRepository.find({
      where: { status: "pending" },
      order: { created_at: "ASC" }, // Có thể dùng sort từ query nếu cần
      skip,
      take,
    })

    // Lấy thông tin user cho từng comment
    const comments = await Promise.all(
      pendingComments.map(async (comment) => {
        const user = await this.userRepository.findOne({
          where: { id: comment.user_id },
        })

        return {
          id: comment.id,
          post_id: comment.post_id,
          user_id: comment.user_id,
          content: comment.content,
          status: comment.status,
          parent_id: comment.parent_id,
          created_at: comment.created_at.toISOString().split("T")[0],
          author: user?.username || "Anonymous",
        }
      }),
    )

    // Trả về response với meta và results
    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results: comments,
    }
  }
}

