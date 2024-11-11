import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой задачи' })
  @ApiResponse({ status: 201, description: 'Задача успешно создана.' })
  @ApiResponse({ status: 400, description: 'Неверные данные.' })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех задач' })
  @ApiResponse({ status: 200, description: 'Список всех задач.' })
  async findAll(@Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    return this.tasksService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение задачи по ID' })
  @ApiResponse({ status: 200, description: 'Задача найдена.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    return this.tasksService.findOne(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = await this.usersService.findById(req.user['id']);
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiResponse({ status: 200, description: 'Задача успешно удалена.' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    await this.tasksService.remove(id, user);
    return { message: 'Task deleted successfully' };
  }
}
