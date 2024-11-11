import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(botToken);
  }

  onModuleInit() {
    this.bot.start((ctx) =>
      ctx.reply('Welcome! Use /bind <token> to link your account.'),
    );

    this.bot.command('bind', async (ctx) => {
      const message = ctx.message.text;
      const parts = message.split(' ');
      if (parts.length !== 2) {
        ctx.reply('Usage: /bind <token>');
        return;
      }
      const token = parts[1];
      // Предполагается, что токен — это JWT-токен пользователя
      try {
        const payload = this.jwtService.verify(token);
        await this.bindTelegramAccount(ctx.chat.id.toString(), payload.sub);
        await ctx.reply('Your Telegram account has been linked.');
      } catch (err) {
        await ctx.reply('Invalid token.');
      }
    });

    this.bot.on('text', async (ctx) => {
      const message = ctx.message.text;
      const chatId = ctx.chat.id.toString();

      const user = await this.usersService.findByTelegramId(chatId);
      if (!user) {
        await ctx.reply(
          'You are not registered. Use /bind <token> to link your account.',
        );
        return;
      }

      // Логика обработки сообщений
      // Например, создание задачи из сообщения
      // Пример:
      // const task = await this.tasksService.createFromTelegramMessage(user, message);
      ctx.reply('Your message has been received and processed.');
    });

    this.bot.launch();
  }

  async sendMessage(telegramId: string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message);
  }

  async bindTelegramAccount(chatId: string, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.telegramId = chatId;
    await this.usersService.updateTelegramId(userId, chatId);
  }
}
