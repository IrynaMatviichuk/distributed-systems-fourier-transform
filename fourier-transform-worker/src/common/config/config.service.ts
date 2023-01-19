import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class ConfigService {
  redis = {
    url: process.env.REDIS_URL,
  };
}
