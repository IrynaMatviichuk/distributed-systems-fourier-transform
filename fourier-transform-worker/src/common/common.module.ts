import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [ConfigModule, QueueModule],
  exports: [ConfigModule, QueueModule],
})
export class CommonModule {}
