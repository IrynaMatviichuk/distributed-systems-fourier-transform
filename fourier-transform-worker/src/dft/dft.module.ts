import { Module } from '@nestjs/common';
import { DftProcessor } from './dft.processor';
import { BullModule } from '@nestjs/bull';
import { QueueType } from '../common/enum/queue-type.enum';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.fourierTransform }),
    BullModule.registerQueue({ name: QueueType.fourierResult }),
  ],
  providers: [DftProcessor],
})
export class DftModule {}
