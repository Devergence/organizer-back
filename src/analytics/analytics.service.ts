import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    private tasksService: TasksService,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getProductivityStats(user: User, period: 'day' | 'week' | 'month') {
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'day':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const day = now.getDay();
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - day,
        );
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const end = now;

    const completedTasks = await this.tasksService.countCompletedTasks(
      user,
      start,
      end,
    );
    const totalTasks = await this.tasksService.countTasks(user, start, end);

    return {
      period,
      completedTasks,
      totalTasks,
      productivity: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }

  async getCategoryStats(user: User) {
    return await this.tasksRepository
      .createQueryBuilder('task')
      .select('task.category')
      .addSelect('COUNT(task.id)', 'count')
      .where('task.userId = :userId', { userId: user.id })
      .groupBy('task.category')
      .getRawMany();
  }

  async getPriorityStats(user: User) {
    return await this.tasksRepository
      .createQueryBuilder('task')
      .select('task.priority')
      .addSelect('COUNT(task.id)', 'count')
      .where('task.userId = :userId', { userId: user.id })
      .groupBy('task.priority')
      .getRawMany();
  }

  // Дополнительные методы для аналитики могут быть добавлены здесь
}
