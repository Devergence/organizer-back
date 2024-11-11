import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() body: { message: string; scheduledAt: Date },
    @Req() req: Request,
  ) {
    // Предполагается, что body содержит message и scheduledAt
    // Реализуйте валидацию и другие проверки по необходимости
    // Также может понадобиться получить пользователя из запроса
    // Пример:
    // const user = req.user
    // return this.notificationsService.createNotification(body.message, body.scheduledAt, user)
    return { message: 'Not implemented' };
  }
}
