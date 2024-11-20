import { Module } from '@nestjs/common';
import { AiBackEndController } from './ai-back-end.controller';
import { AiBackEndService } from './ai-back-end.service';

@Module({
  controllers: [AiBackEndController],
  providers: [AiBackEndService],
})
export class AiBackEndModule {}
