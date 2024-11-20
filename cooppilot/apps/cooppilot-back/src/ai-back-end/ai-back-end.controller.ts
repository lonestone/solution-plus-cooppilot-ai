import { CurrentUser } from '@/user/currentUser.decorator';
import { User } from '@/user/user.type';
import { chatEntryFeedbackSchema } from '@common/types/back/chat';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AiBackEndService } from './ai-back-end.service';

@Controller('ai')
export class AiBackEndController {
  constructor(private readonly aiBackEndService: AiBackEndService) {}

  @Get('chat')
  async getChatEntries(@CurrentUser() user: User | null) {
    if (user == null) throw new UnauthorizedException('no user');
    return this.aiBackEndService.getChatEntries(user);
  }

  @Get('chat/:entryId')
  async getChatEntry(
    @Param('entryId') entryId: number,
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');
    return this.aiBackEndService.getChatEntry(entryId, user);
  }

  @Post('chat/create')
  async createChatEntry(
    @Body() body: { message: string },
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');
    return this.aiBackEndService.createChatEntry(body.message, user);
  }

  @Post('chat/:chatEntryId/feedback')
  async createOrUpdateFeedbackOnChatEntry(
    @Param('chatEntryId') chatEntryId: number,
    @Body() body: unknown,
    @Res() res: Response,
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');

    const request = chatEntryFeedbackSchema.parse(body);

    const status =
      await this.aiBackEndService.createOrUpdateFeedbackOnChatEntry(
        chatEntryId,
        request,
        user,
      );

    if (status === 201) {
      res.status(HttpStatus.CREATED).send({ status: 'created' });
    } else {
      res.status(HttpStatus.OK).send({ status: 'updated' });
    }
  }

  @Get('chat/clear/history')
  async getLastChatCleanup(@CurrentUser() user: User | null) {
    if (user == null) throw new UnauthorizedException('no user');

    const res = await this.aiBackEndService.getLastChatCleanup(user.id);

    if (res === null) {
      return { lastCleanup: null };
    }

    return { lastCleanup: res.lastCleanup };
  }

  @Post('chat/clear/history')
  async cleanChatHistory(@CurrentUser() user: User | null) {
    if (user == null) throw new UnauthorizedException('no user');
    await this.aiBackEndService.cleanChatHistory(user.id);
  }
}
