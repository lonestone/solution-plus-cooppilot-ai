import { PrismaService } from '@/prisma.service';
import { getAuthFromUser, User } from '@/user/user.type';
import { chatEntriesFetcher } from '@common/back-admin/fetchers/chatEntriesFetcher';
import { chatEntryFetcher } from '@common/back-admin/fetchers/chatEntryFetcher';
import { createChatEntry } from '@common/back-admin/mutations/createChatEntry';
import { createOrUpdateChatEntryFeedback } from '@common/back-admin/mutations/createOrUpdateChatEntryFeedback';
import { ChatEntry, ChatEntryFeedback } from '@common/types/back/chat';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserChatHistoryCleanup } from '@prisma/client';

@Injectable()
export class AiBackEndService {
  private readonly logger = new Logger(AiBackEndService.name);

  private orgId: string;
  private projId: string;

  constructor(
    private readonly prisma: PrismaService,
    readonly configService: ConfigService,
  ) {
    this.orgId = configService.getOrThrow('ORGANIZATION_ID');
    this.projId = configService.getOrThrow('PROJECT_ID');

    this.logger.log(`Using orgId: "${this.orgId}", projId: "${this.projId}"`);
  }

  async getLastChatCleanup(
    userId: string,
  ): Promise<UserChatHistoryCleanup | null> {
    const latestHistoryCleanup =
      await this.prisma.userChatHistoryCleanup.findFirst({
        where: { userId },
      });

    return latestHistoryCleanup;
  }

  async cleanChatHistory(userId: string): Promise<void> {
    const existing = await this.prisma.userChatHistoryCleanup.findFirst({
      where: { userId },
    });

    if (existing) {
      await this.prisma.userChatHistoryCleanup.update({
        where: { id: existing.id },
        data: {
          lastCleanup: new Date(),
        },
      });
    } else {
      await this.prisma.userChatHistoryCleanup.create({
        data: {
          userId,
          lastCleanup: new Date(),
        },
      });
    }
  }

  async getChatEntries(user: User): Promise<ChatEntry[]> {
    return chatEntriesFetcher({
      orgId: this.orgId,
      projId: this.projId,
      authHeaders: getAuthFromUser(user),
    });
  }

  async getChatEntry(entryId: number, user: User): Promise<ChatEntry> {
    return chatEntryFetcher({
      orgId: this.orgId,
      projId: this.projId,
      chatEntryId: entryId,
      authHeaders: getAuthFromUser(user),
    });
  }

  async createChatEntry(message: string, user: User): Promise<ChatEntry> {
    const latestHistoryCleanup =
      await this.prisma.userChatHistoryCleanup.findFirst({
        where: { userId: user.id },
      });

    const res = await createChatEntry({
      orgId: this.orgId,
      projId: this.projId,
      history_starting_at: latestHistoryCleanup?.lastCleanup,
      message,
      authHeaders: getAuthFromUser(user),
    });

    return res;
  }

  async createOrUpdateFeedbackOnChatEntry(
    chatEntryId: number,
    feedback: ChatEntryFeedback,
    user: User,
  ): Promise<number> {
    const res = await createOrUpdateChatEntryFeedback({
      orgId: this.orgId,
      projId: this.projId,
      chatEntryId,
      feedback,
      authHeaders: getAuthFromUser(user),
    });

    return res;
  }
}
