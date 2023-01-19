import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { QueueType } from '../common/enum/queue-type.enum';

import { DftCalculator } from './calculator/dft.calculator';

@Processor(QueueType.fourierTransform)
export class DftProcessor {
  constructor(
    @InjectQueue(QueueType.fourierResult)
    private readonly fourierResultQueue: Queue,
  ) {}

  @Process()
  public async handle(
    job: Job<{
      taskId: string;
      initialK: number;
      finalK: number;
      n: number;
      vector: number[];
    }>,
  ): Promise<void> {
    const { taskId, initialK, finalK, n, vector } = job.data;
    const calculator = new DftCalculator();
    const result = calculator.partiallyCalculateLoop(
      initialK,
      finalK,
      n,
      vector,
    );

    await this.fourierResultQueue.add({ taskId, result, jobId: job.id });
  }
}
