import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class NotificationsProcessor {
  constructor(
    private notificationsService: NotificationsService,
    private telegramService: TelegramService,
  ) {}

  @Cron('*/1 * * * *') // Каждую минуту
  async handleCron() {
    const notifications =
      await this.notificationsService.findPendingNotifications();
    for (const notification of notifications) {
      // Отправка уведомления через Telegram
      if (notification.user.telegramId) {
        await this.telegramService.sendMessage(
          notification.user.telegramId,
          notification.message,
        );
      }
      // Отметить уведомление как отправленное
      await this.notificationsService.markAsSent(notification);
    }
  }
}
