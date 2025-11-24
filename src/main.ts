import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     }),
//   );
//   app.setGlobalPrefix('api/v1', { exclude: [''] });

//   // fix privacy cors
//   app.enableCors({
//     origin: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     credentials: true,
//   });

//   await app.listen(process.env.PORT ?? 8080);

//   // show routes
//   const server = app.getHttpServer();
//   const router = server._events.request._router;

//   Logger.log('Available Routes:', 'Bootstrap');
//   router.stack
//     .filter((layer) => layer.route)
//     .forEach((layer) => {
//       Logger.log(
//         `${Object.keys(layer.route.methods)
//           .map((method) => method.toUpperCase())
//           .join(', ')} ${layer.route.path}`,
//         'Route',
//       );
//     });
// }

async function bootstrap() {
  // Ép kiểu app thành NestExpressApplication để dùng useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  // Fix privacy CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  // Phục vụ file tĩnh từ thư mục uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads/images'), {
    prefix: '/uploads/images', // Đường dẫn truy cập: /uploads/...
  });

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
