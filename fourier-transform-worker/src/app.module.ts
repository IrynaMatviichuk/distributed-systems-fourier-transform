import { Module } from '@nestjs/common';
import { DftModule } from './dft/dft.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [DftModule, CommonModule],
})
export class AppModule {}
