import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsProcessor } from './notifications.processor';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
  providers: [NotificationsService, NotificationsProcessor, TelegramService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
