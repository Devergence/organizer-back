import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  async getProfile(@Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    return { id: user.id, email: user.email, telegramId: user.telegramId };
  }
}
