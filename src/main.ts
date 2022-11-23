import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import SwaggerConfig from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  SwaggerConfig(app);

  app.use(helmet());
  await app.listen(process.env.PORT);
}
bootstrap();
