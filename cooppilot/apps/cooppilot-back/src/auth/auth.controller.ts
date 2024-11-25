import { CurrentUser } from '@/user/currentUser.decorator';
import { User } from '@/user/user.type';
import { Controller, Get, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('me')
  async me(@CurrentUser() user: User | null) {
    if (user == null) throw new UnauthorizedException('no user');
    return user;
  }
}
