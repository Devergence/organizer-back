import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(
    message: string,
    scheduledAt: Date,
    user: User,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      message,
      scheduledAt,
      user,
    });
    return this.notificationsRepository.save(notification);
  }

  async findPendingNotifications(): Promise<Notification[]> {
    const now = new Date();
    return this.notificationsRepository.find({
      where: {
        isSent: false,
        scheduledAt: now.toISOString(),
      },
      relations: ['user'],
    });
  }

  async markAsSent(notification: Notification): Promise<void> {
    notification.isSent = true;
    await this.notificationsRepository.save(notification);
  }
}
