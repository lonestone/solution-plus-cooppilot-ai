import { Reflector } from '@nestjs/core';
import { AccessRole } from './access-role';

export const AccessRoles = Reflector.createDecorator<
  AccessRole[] | undefined
>();
