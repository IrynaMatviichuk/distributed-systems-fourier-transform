import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { QueueType } from '../common/enum/queue-type.enum';
import { TaskStatus } from './enum/task-status.enum';
import { TaskChunk, TaskChunkDocument } from './schemas/task-chunk.schema';
import { Task, TaskDocument } from './schemas/task.schema';

@Processor(QueueType.fourierResult)
export class FourierResultProcessor {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(TaskChunk.name)
    private readonly taskChunkModel: Model<TaskChunkDocument>,
  ) {}

  @Process()
  public async handle(
    job: Job<{
      taskId: string;
      jobId: number;
      result: Record<string, [number, number]>;
    }>,
  ): Promise<void> {
    const { taskId, jobId, result } = job.data;
    const task = await this.taskModel.findById(taskId).exec();
    const taskChunk = await this.taskChunkModel
      .findOne({
        task,
        jobId,
      })
      .orFail(new Error(`Job with id=${jobId} not found`))
      .exec();
    const taskChunks = await this.taskChunkModel.find({
      task,
      jobId: { $ne: jobId },
    });

    taskChunk.status = TaskStatus.done;
    task.result = JSON.stringify({ ...JSON.parse(task.result), ...result });
    if (taskChunks.every((chunk) => chunk.status === TaskStatus.done)) {
      task.status = TaskStatus.done;
      task.executionEnd = new Date();
    }

    await Promise.all([
      task.save(),
      taskChunk.save(),
      ...taskChunks.map((chunk) => chunk.save()),
    ]);
  }
}
