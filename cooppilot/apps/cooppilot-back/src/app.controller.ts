import { Controller, Get } from '@nestjs/common';
import { AccessRole } from './access-role';
import { AccessRoles } from './access-roles.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AccessRoles([AccessRole.Public])
  @Get('health-check')
  getHealthCheck() {
    return { status: 'ok', id: 'cooppilot-back' };
  }
}
