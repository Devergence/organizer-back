import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private usersService: UsersService,
  ) {}

  @Get('productivity')
  async getProductivity(
    @Query('period') period: 'day' | 'week' | 'month',
    @Req() req: Request,
  ) {
    const user = await this.usersService.findById(req.user['id']);
    return this.analyticsService.getProductivityStats(user, period);
  }

  @Get('categories')
  async getCategoryStats(@Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    return this.analyticsService.getCategoryStats(user);
  }

  @Get('priorities')
  async getPriorityStats(@Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    return this.analyticsService.getPriorityStats(user);
  }

  // Другие аналитические эндпоинты могут быть добавлены здесь
}
