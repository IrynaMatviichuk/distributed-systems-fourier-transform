import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DftService } from './dft.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskChunk } from './schemas/task-chunk.schema';
import { Task } from './schemas/task.schema';
import { Complex } from './type/complex.type';

@Controller('dft')
export class DftController {
  constructor(private readonly dftService: DftService) {}

  @Get('/task')
  public async getTasks(
    @Query() query: { limit: number; skip: number },
  ): Promise<Task[]> {
    return this.dftService.getTasks(query.limit, query.skip);
  }

  @Get('/task/:taskId')
  public async getTaskResult(
    @Param('taskId') taskId: string,
  ): Promise<Complex[]> {
    return this.dftService.getTaskResult(taskId);
  }

  @Post('/task')
  public async createTask(
    @Body() request: CreateTaskDto,
  ): Promise<{ task: Task; chunks: TaskChunk[] }> {
    return this.dftService.transform(request.signal, request.split);
  }

  @Post('/task/compare')
  public async compareTask(
    @Body() request: CreateTaskDto,
  ): Promise<{ task: Task; chunks: TaskChunk[] }> {
    return this.dftService.compare(request.signal);
  }
}
