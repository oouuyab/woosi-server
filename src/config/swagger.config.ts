import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function SwaggerConfig(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Woosi Swagger')
    .setDescription('The Woosi API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
}
