import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisUri = new URL(configService.redis.url);

        return {
          redis: {
            host: redisUri.hostname,
            port: Number(redisUri.port),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class QueueModule {}
