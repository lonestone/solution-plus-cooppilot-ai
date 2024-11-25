import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as pack from '../package.json';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  logger.log(`--------------------------------`);
  logger.log(`${pack.name} v${pack.version}`);
  logger.log(`--------------------------------`);

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: {
      // TODO INFRA change to fixed origin when DNS is ready
      origin: '*',
    },
  });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  const port = configService.get('APP_PORT') ?? 3000;
  await app.listen(port);

  logger.log(`Server started on port ${port}`);
}
bootstrap();
