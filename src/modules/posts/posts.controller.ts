import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Delete,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Public } from '@/decorator/customize';
import { PostResponseDto } from './dto/response-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storeConfig } from '@/helpers/utils';
import { extname } from 'path';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('each-post')
  @Public()
  getPosts() {
    return this.postsService.getEachPost();
  }

  @Patch('update')
  @Public()
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePostById(updatePostDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<any> {
    return this.postsService.deleteById(id);
  }

  @Get('custom/:slug')
  @Public()
  async getCustomPostBySlug(
    @Param('slug') slug: string,
  ): Promise<PostResponseDto | null> {
    const post = await this.postsService.getCustomPostBySlug(slug);
    return post;
  }

  @Get('custom/with/:id')
  @Public()
  async getCustomPostById(
    @Param('id') id: string,
  ): Promise<PostResponseDto | null> {
    const post = await this.postsService.getCustomPostById(id);
    return post;
  }

  // @Get('custom')
  // @Public()
  // async getCustomPosts(
  //   @Query() query: string,
  //   @Query('current') current: string,
  //   @Query('pageSize') pageSize: string,
  // ) {
  //   const posts = await this.postsService.getCustomPosts(
  //     query,
  //     +current,
  //     +pageSize,
  //   );
  //   return posts;
  // }

  @Get('custom')
  @Public()
  async getCustomPosts(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search: string,
  ) {
    // Pass the search parameter to the service
    const posts = await this.postsService.getCustomPosts(
      query,
      +current,
      +pageSize,
      search,
    );
    return posts;
  }

  // should merge with getCustomPosts
  @Get('custom/category/:id?')
  @Public()
  async getCustomPostByCategory(
    @Query('search') search: string | undefined, // Chỉ lấy query search nếu có
    @Query('current') current: string = '1', // Giá trị mặc định
    @Query('pageSize') pageSize: string = '6', // Giá trị mặc định
    @Param('id') id?: string, // id là tùy chọn
  ) {
    const posts = await this.postsService.getCustomPostByCategory(
      search,
      +current || 1,
      +pageSize || 6,
      id,
    );
    return posts;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.removePostById(id);
  }

  @Get(':slug')
  @Public()
  getPostBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug(slug);
  }

  @Post('/create')
  @Public()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post('upload-image/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storeConfig('images'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.jpeg', '.webp', '.png'];
        if (!allowedExtArr.includes(ext)) {
          req.message = 'Wrong extension type';
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.message = 'File size is too large';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @Public()
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.uploadImagePost(
      id,
      file.destination + '/' + file.filename,
    );
  }
}
