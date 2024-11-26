import { backAdminConfig } from '@common/back-admin/backAdminConfig';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { PrismaService } from './prisma.service';

function getEnvFilePath() {
  return process.env.REMOTE_CONTAINERS || process.env.REMOTE_CONTAINERS_IPC
    ? '.env.container.dev'
    : '.env.local.dev';
}

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: [getEnvFilePath()] })],
})
export class GlobalModule {
  static forRoot(): DynamicModule {
    dotenv.config({
      path: resolve(__dirname, '../../../', getEnvFilePath()),
    });

    backAdminConfig.endpoint = process.env.ADMIN_BACKEND_ENDPOINT!;

    const providers = [ConfigModule, PrismaService];

    return {
      global: true,
      module: GlobalModule,
      providers: providers,
      exports: providers,
    };
  }
}
