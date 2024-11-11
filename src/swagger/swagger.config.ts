import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Личный Органайзер')
    .setDescription('Документация API для приложения Личный Органайзер')
    .setVersion('1.0')
    .addBearerAuth() // Добавляем аутентификацию через Bearer токены
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
