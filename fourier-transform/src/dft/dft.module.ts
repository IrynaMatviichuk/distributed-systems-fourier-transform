import { Module } from '@nestjs/common';
import { DftService } from './dft.service';
import { QueueType } from '../common/enum/queue-type.enum';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { FourierResultProcessor } from './fourier-result.processor';
import { TaskChunk, TaskChunkSchema } from './schemas/task-chunk.schema';
import { DftController } from './dft.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.fourierTransform }),
    BullModule.registerQueue({ name: QueueType.fourierResult }),
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: TaskChunk.name, schema: TaskChunkSchema },
    ]),
  ],
  providers: [DftService, FourierResultProcessor],
  exports: [DftService],
  controllers: [DftController],
})
export class DftModule {}
