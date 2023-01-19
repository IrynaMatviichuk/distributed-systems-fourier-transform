import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model, Types } from 'mongoose';
import { QueueType } from '../common/enum/queue-type.enum';
import { TaskStatus } from './enum/task-status.enum';
import { TaskChunk, TaskChunkDocument } from './schemas/task-chunk.schema';
import { Task, TaskDocument } from './schemas/task.schema';
import { Complex } from './type/complex.type';
import { dft } from 'fft-js';

@Injectable()
export class DftService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(TaskChunk.name)
    private readonly taskChunkModel: Model<TaskChunkDocument>,
    @InjectQueue(QueueType.fourierTransform)
    private readonly fourierTransformQueue: Queue,
  ) {}

  public async getTasks(limit = 10, skip = 0): Promise<Task[]> {
    return this.taskModel
      .find()
      .select(['status', 'subtaskIds', 'executionStart', 'executionEnd'])
      .limit(limit)
      .skip(skip)
      .sort({ executionStart: 'desc' })
      .exec();
  }

  public async getTaskResult(taskId: string): Promise<Complex[]> {
    const task = await this.taskModel.findOne({ _id: taskId }).exec();
    const parsedResult = JSON.parse(task.result);
    const result = [];
    Object.entries(parsedResult).forEach(([k, value]) => {
      result[Number(k)] = value;
    });

    return result;
  }

  public async compare(signal: number[]) {
    return dft(signal);
  }

  public async transform(
    signal: number[],
    split = 1,
  ): Promise<{ task: Task; chunks: TaskChunk[] }> {
    const n = signal.length;
    const taskChunks = this.splitIntoChunks(n, split);
    console.log(taskChunks);

    const taskId = new Types.ObjectId();

    const jobs = await Promise.all(
      taskChunks.map(([initialK, finalK]) =>
        this.fourierTransformQueue.add({
          taskId,
          initialK,
          finalK,
          n,
          vector: signal,
        }),
      ),
    );

    const createdTask = new this.taskModel({
      _id: taskId,
      status: TaskStatus.inProgress,
      subtaskIds: jobs.map((job) => job.id),
      result: JSON.stringify({}),
      executionStart: new Date(),
      executionEnd: null,
    });

    await createdTask.save();

    const createdTaskChunks = jobs.map(
      (job) =>
        new this.taskChunkModel({
          status: TaskStatus.inProgress,
          jobId: job.id,
          task: createdTask,
        }),
    );

    await Promise.all(
      createdTaskChunks.map((createdTaskChunk) => createdTaskChunk.save()),
    );

    return { task: createdTask, chunks: createdTaskChunks };
  }

  public splitIntoChunks(N: number, chunksNumber: number): [number, number][] {
    const step = Math.ceil(N / chunksNumber);
    if (step < 1) {
      throw new Error('Too big chunks number');
    }

    const chunks = [];
    for (let chunkStart = 0; chunkStart < N; chunkStart += step + 1) {
      chunks.push([
        chunkStart,
        chunkStart + step < N - 1 ? chunkStart + step : N - 1,
      ]);
    }

    return chunks;
  }
}
