import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { existsSync, mkdirSync } from 'node:fs';

async function bootstrap() {
  /*if (!existsSync('./public/imagenes')) {
    mkdirSync('./public/imagenes', { recursive: true });
  }*/
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
