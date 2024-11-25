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

  @Get('chat/_/:projectSlug')
  async getChatEntries(
    @Param('projectSlug') projectSlug: string,
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');
    const entries = await this.aiBackEndService.getChatEntries(
      projectSlug,
      user,
    );

    const cleanUp = await this.getLastChatCleanup(user);

    if (cleanUp.lastCleanup == null) return entries;

    return entries.filter(
      (entry) => entry.createdAt.getTime() > cleanUp.lastCleanup.getTime(),
    );
  }

  @Get('chat/_/:projectSlug/:entryId')
  async getChatEntry(
    @Param('projectSlug') projectSlug: string,
    @Param('entryId') entryId: number,
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');
    return this.aiBackEndService.getChatEntry(projectSlug, entryId, user);
  }

  @Post('chat/_/:projectSlug/create')
  async createChatEntry(
    @Param('projectSlug') projectSlug: string,
    @Body() body: { message: string },
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');
    return this.aiBackEndService.createChatEntry(
      projectSlug,
      body.message,
      user,
    );
  }

  @Post('chat/_/:projectSlug/:chatEntryId/feedback')
  async createOrUpdateFeedbackOnChatEntry(
    @Param('projectSlug') projectSlug: string,
    @Param('chatEntryId') chatEntryId: number,
    @Body() body: unknown,
    @Res() res: Response,
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');

    const request = chatEntryFeedbackSchema.parse(body);

    const status =
      await this.aiBackEndService.createOrUpdateFeedbackOnChatEntry(
        projectSlug,
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
