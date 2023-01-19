import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [ConfigModule, DatabaseModule, QueueModule],
  exports: [ConfigModule, DatabaseModule, QueueModule],
})
export class CommonModule {}
