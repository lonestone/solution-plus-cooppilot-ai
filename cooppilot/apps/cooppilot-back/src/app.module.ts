import { Module } from '@nestjs/common';

import { AiBackEndModule } from '@/ai-back-end/ai-back-end.module';
import { AuthModule } from '@/auth/auth.module';
import { WhisperModule } from '@/whisper/whisper.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    GlobalModule.forRoot(),
    AiBackEndModule,
    WhisperModule,
    MetricsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
