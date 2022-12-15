import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import SwaggerConfig from './config/swagger.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  SwaggerConfig(app);

  // TODO: cors 설정
  app.enableCors();

  app.use(helmet());
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
