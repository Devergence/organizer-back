import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user },
      relations: ['subtasks', 'comments', 'notes'],
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user },
      relations: ['subtasks', 'comments', 'notes'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.tasksRepository.remove(task);
  }

  async countCompletedTasks(
    user: User,
    start: Date,
    end: Date,
  ): Promise<number> {
    return this.tasksRepository.count({
      where: {
        user,
        isCompleted: true,
        updatedAt: Between(start, end),
      },
    });
  }

  async countTasks(user: User, start: Date, end: Date): Promise<number> {
    return this.tasksRepository.count({
      where: {
        user,
        createdAt: Between(start, end),
      },
    });
  }
}
