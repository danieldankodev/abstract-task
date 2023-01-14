import { Module } from '@nestjs/common';
import { RubacService } from './rubac.service';

@Module({
  imports: [],
  providers: [RubacService],
  exports: [RubacService],
})
export class RubacModule {}
