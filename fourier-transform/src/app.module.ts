import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DftModule } from './dft/dft.module';

@Module({
  imports: [CommonModule, DftModule],
})
export class AppModule {}
