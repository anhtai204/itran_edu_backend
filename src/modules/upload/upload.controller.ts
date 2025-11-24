import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Req, UploadedFiles } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { storeConfig } from '@/helpers/utils';
import { extname, join } from 'path';
import { Public } from '@/decorator/customize';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

// Định nghĩa cấu hình cho các loại file
const fileTypeConfigs: Record<
  string,
  { allowedExt: string[]; maxSize: number; folder: string }
> = {
  image: {
    allowedExt: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: 'images',
  },
  pdf: {
    allowedExt: ['.pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'pdfs',
  },
  video: {
    allowedExt: ['.mp4', '.mov', '.avi'],
    maxSize: 50 * 1024 * 1024, // 50MB
    folder: 'videos',
  },
  document: {
    allowedExt: ['.doc', '.docx', '.txt'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'documents',
  },
  audio: {
    allowedExt: ['.mp3', '.wav', '.ogg'],
    maxSize: 20 * 1024 * 1024, // 20MB
    folder: 'audio',
  },
  archive: {
    allowedExt: ['.zip', '.rar', '.7z'],
    maxSize: 100 * 1024 * 1024, // 100MB
    folder: 'archives',
  },
  spreadsheet: {
    allowedExt: ['.xls', '.xlsx', '.csv'],
    maxSize: 15 * 1024 * 1024, // 15MB
    folder: 'spreadsheets',
  },
  presentation: {
    allowedExt: ['.ppt', '.pptx', '.key'],
    maxSize: 20 * 1024 * 1024, // 20MB
    folder: 'presentations',
  },
  code: {
    allowedExt: ['.js', '.py', '.java', '.cpp', '.html', '.css'],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: 'code',
  },
  font: {
    allowedExt: ['.ttf', '.otf', '.woff', '.woff2'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'fonts',
  },
  ebook: {
    allowedExt: ['.epub', '.mobi', '.azw3'],
    maxSize: 20 * 1024 * 1024, // 20MB
    folder: 'ebooks',
  },
  database: {
    allowedExt: ['.sqlite', '.sql', '.db'],
    maxSize: 50 * 1024 * 1024, // 50MB
    folder: 'databases',
  },
  vector: {
    allowedExt: ['.svg', '.eps', '.ai'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'vectors',
  },
  executable: {
    allowedExt: ['.exe', '.jar', '.apk'],
    maxSize: 100 * 1024 * 1024, // 100MB
    folder: 'executables',
  },
  notebook: {
    allowedExt: ['.ipynb'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'notebooks',
  },
};

// Hàm xác định loại file dựa trên mimetype hoặc phần mở rộng
const getFileType = (file: Express.Multer.File): string => {
  const ext = extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  // Image
  if (fileTypeConfigs.image.allowedExt.includes(ext) || mime.startsWith('image/')) {
    return 'image';
  }
  // PDF
  if (fileTypeConfigs.pdf.allowedExt.includes(ext) || mime === 'application/pdf') {
    return 'pdf';
  }
  // Video
  if (fileTypeConfigs.video.allowedExt.includes(ext) || mime.startsWith('video/')) {
    return 'video';
  }
  // Audio
  if (fileTypeConfigs.audio.allowedExt.includes(ext) || mime.startsWith('audio/')) {
    return 'audio';
  }
  // Document
  if (
    fileTypeConfigs.document.allowedExt.includes(ext) ||
    mime === 'application/msword' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'text/plain'
  ) {
    return 'document';
  }
  // Archive
  if (
    fileTypeConfigs.archive.allowedExt.includes(ext) ||
    mime === 'application/zip' ||
    mime === 'application/x-rar-compressed' ||
    mime === 'application/x-7z-compressed'
  ) {
    return 'archive';
  }
  // Spreadsheet
  if (
    fileTypeConfigs.spreadsheet.allowedExt.includes(ext) ||
    mime === 'application/vnd.ms-excel' ||
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mime === 'text/csv'
  ) {
    return 'spreadsheet';
  }
  // Presentation
  if (
    fileTypeConfigs.presentation.allowedExt.includes(ext) ||
    mime === 'application/vnd.ms-powerpoint' ||
    mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mime === 'application/x-iwork-keynote-sffkey'
  ) {
    return 'presentation';
  }
  // Code
  if (
    fileTypeConfigs.code.allowedExt.includes(ext) ||
    mime === 'application/javascript' ||
    mime === 'text/x-python' ||
    mime === 'text/x-java-source' ||
    mime === 'text/x-c++src' ||
    mime === 'text/html' ||
    mime === 'text/css'
  ) {
    return 'code';
  }
  // Font
  if (
    fileTypeConfigs.font.allowedExt.includes(ext) ||
    mime === 'font/ttf' ||
    mime === 'font/otf' ||
    mime === 'font/woff' ||
    mime === 'font/woff2' ||
    mime.includes('application/font')
  ) {
    return 'font';
  }
  // Ebook
  if (
    fileTypeConfigs.ebook.allowedExt.includes(ext) ||
    mime === 'application/epub+zip' ||
    mime === 'application/x-mobipocket-ebook' ||
    mime === 'application/vnd.amazon.ebook'
  ) {
    return 'ebook';
  }
  // Database
  if (
    fileTypeConfigs.database.allowedExt.includes(ext) ||
    mime === 'application/x-sqlite3' ||
    mime === 'application/sql' ||
    mime === 'application/x-database'
  ) {
    return 'database';
  }
  // Vector
  if (
    fileTypeConfigs.vector.allowedExt.includes(ext) ||
    mime === 'image/svg+xml' ||
    mime === 'application/postscript' ||
    mime === 'application/illustrator'
  ) {
    return 'vector';
  }
  // Executable
  if (
    fileTypeConfigs.executable.allowedExt.includes(ext) ||
    mime === 'application/x-msdownload' ||
    mime === 'application/java-archive' ||
    mime === 'application/vnd.android.package-archive'
  ) {
    return 'executable';
  }
  // Notebook
  if (
    fileTypeConfigs.notebook.allowedExt.includes(ext) ||
    mime === 'application/x-ipynb+json'
  ) {
    return 'notebook';
  }

  return '';
};

// Hàm cấu hình storage cho multer
const storeConfig = (file: Express.Multer.File) => {
  const fileType = getFileType(file);
  const config = fileTypeConfigs[fileType] || fileTypeConfigs.image;
  const uploadPath = join(process.cwd(), 'uploads', config.folder);

  // Tạo thư mục nếu chưa tồn tại
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });
};

// Hàm kiểm tra file
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const fileType = getFileType(file);
  if (!fileType) {
    req.message = 'Unsupported file type';
    return cb(null, false);
  }

  const config = fileTypeConfigs[fileType];
  const ext = extname(file.originalname).toLowerCase();
  if (!config.allowedExt.includes(ext)) {
    req.message = `Invalid extension for ${fileType}. Allowed: ${config.allowedExt.join(', ')}`;
    return cb(null, false);
  }

  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > config.maxSize) {
    req.message = `File size too large for ${fileType}. Max: ${config.maxSize / (1024 * 1024)}MB`;
    return cb(null, false);
  }

  cb(null, true);
};


@Controller('upload')
export class UploadController {
  // @Post()
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: storeConfig('images'),
  //   fileFilter: (req, file, cb) => {
  //       const ext = extname(file.originalname);
  //       const allowedExtArr = ['.jpg', '.jpeg', '.webp', '.png'];
  //       if (!allowedExtArr.includes(ext)) {
  //         req.message = 'Wrong extension type';
  //         cb(null, false);
  //       } else {
  //         const fileSize = parseInt(req.headers['content-length']);
  //         if (fileSize > 1024 * 1024 * 5) {
  //           req.message = 'File size is too large';
  //           cb(null, false);
  //         } else {
  //           cb(null, true);
  //         }
  //       }
  //     },
  //   }),
  // )
  // @Public()
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   // console.log('>>> Uploaded file:', file);
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }
  //   const result = {
  //     message: 'File uploaded successfully',
  //     url: `${file.destination}/${file.filename}`,
  //   }
  //   console.log('>>> result:', result);
  //   return {
  //     message: 'File uploaded successfully',
  //     url: `${file.destination}/${file.filename}`,
  //   };
  // }

  @Post('single')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination sẽ được xác định động trong fileFilter
        destination: (req, file, cb) => {
          const fileType = getFileType(file);
          const config = fileTypeConfigs[fileType] || fileTypeConfigs.image;
          const uploadPath = join(process.cwd(), 'uploads', config.folder);
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException(req.message || 'No file uploaded');
    }
    return {
      message: 'File uploaded successfully',
      url: `uploads/${fileTypeConfigs[getFileType(file)].folder}/${file.filename}`,
      fileType: getFileType(file),
    };
  }

  @Post('multiple')
  @Public()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const fileType = getFileType(file);
          const config = fileTypeConfigs[fileType] || fileTypeConfigs.image;
          const uploadPath = join(process.cwd(), 'uploads', config.folder);
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Req() req: any) {
      if (!files || files.length === 0) {
      throw new BadRequestException(req.message || 'No files uploaded');
    }
    console.log('>>>length: ', files.length);
    files.forEach(file => {
      console.log('>>>file: ', file)
    });
      return {
      message: 'Files uploaded successfully',
      urls: files.map((file) => `uploads/${fileTypeConfigs[getFileType(file)].folder}/${file.filename}`),
    };
  }

}
