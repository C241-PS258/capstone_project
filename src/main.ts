import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fileUpload from 'express-fileupload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(fileUpload());

  await app.listen(3000);
}
bootstrap();