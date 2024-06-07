import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fileUpload from 'express-fileupload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(fileUpload());
  // loadModel();
  // console.log('model berhasil di load');
  
  await app.listen(3000);
}
bootstrap();