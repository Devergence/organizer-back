import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  // Использование глобального пайпа для валидации
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние свойства
      forbidNonWhitelisted: true, // выбрасывает ошибку при наличии лишних свойств
      transform: true, // автоматически преобразует типы
    }),
  );

  await app.listen(3000);
}
bootstrap();
