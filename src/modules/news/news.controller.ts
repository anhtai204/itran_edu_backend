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
import { Public } from '@/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { storeConfig } from '@/helpers/utils';
import { extname } from 'path';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsResponseDto } from './dto/response-news.dto';
import { CreateNewsDto } from './dto/create-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('each-news')
  @Public()
  getNews() {
    return this.newsService.getEachNews();
  }

  @Patch('update')
  @Public()
  update(@Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNewsById(updateNewsDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<any> {
    return this.newsService.deleteById(id);
  }

  @Get('custom/:slug')
  @Public()
  async getCustomNewsBySlug(
    @Param('slug') slug: string,
  ): Promise<NewsResponseDto | null> {
    const news = await this.newsService.getCustomNewsBySlug(slug);
    return news;
  }

  @Get('custom/with/:id')
  @Public()
  async getCustomNewsById(
    @Param('id') id: string,
  ): Promise<NewsResponseDto | null> {
    const news = await this.newsService.getCustomNewstById(id);
    return news;
  }


  @Get('custom')
  @Public()
  async getCustomNews(
    @Query() query: any,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search: string,
  ) {
    // Pass the search parameter to the service
    const news = await this.newsService.getCustomNews(
      query,
      +current,
      +pageSize,
      search,
    );
    return news;
  }

  // should merge with getCustomPosts
  @Get('custom/category/:id?')
  @Public()
  async getCustomNewsByCategory(
    @Query('search') search: string | undefined, // Chỉ lấy query search nếu có
    @Query('current') current: string = '1', // Giá trị mặc định
    @Query('pageSize') pageSize: string = '6', // Giá trị mặc định
    @Param('id') id?: string, // id là tùy chọn
  ) {
    const news = await this.newsService.getCustomNewsByCategory(
      search,
      +current || 1,
      +pageSize || 6,
      id,
    );
    return news;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.removeNewsById(id);
  }

  @Get(':slug')
  @Public()
  getNewsBySlug(@Param('slug') slug: string) {
    return this.newsService.getNewsBySlug(slug);
  }

  @Post('/create')
  @Public()
  create(@Body() CreateNewsDto: CreateNewsDto) {
    return this.newsService.create(CreateNewsDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
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
    return this.newsService.uploadImageNews(
      id,
      file.destination + '/' + file.filename,
    );
  }
}
