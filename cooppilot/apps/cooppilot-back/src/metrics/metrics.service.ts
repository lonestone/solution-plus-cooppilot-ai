import { getAuthFromUser, User, userMetadataSchema } from '@/user/user.type';
import { orgHistoryFetcher } from '@common/back-admin/fetchers/orgHistoryFetcher';
import * as csv from '@fast-csv/format';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LanguageDetectorBuilder } from '@pemistahl/lingua';
import { Readable } from 'stream';

const headers = [
  'query_id',
  'user_id',
  'user_email',
  'user_country',
  'user_company',
  'created_at_utc',
  'finished_at_utc',
  'response_duration_ms',
  'status',
  'query',
  'query_language_estimation',
  'answer',
  'answer_language_estimation',
  'error',
  'sources',
  'tools',
  'user_feedbacks',
  'token_prompt',
  'token_answer',
  'token_total',
  'cost_estimation_eur',
] as const;

type Header = (typeof headers)[number];

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  private orgId: string;

  constructor(configService: ConfigService) {
    this.orgId = configService.getOrThrow('ORGANIZATION_ID');
  }

  public getMetricsCsvStream(
    {
      startDate,
      endDate,
      standardFormat,
    }: {
      startDate: Date;
      endDate: Date;
      standardFormat: boolean;
    },
    user: User,
  ): Readable {
    const stream = csv.format({
      ...(standardFormat
        ? {}
        : { writeBOM: true, delimiter: ';', quoteColumns: true }),
      alwaysWriteHeaders: true,
      headers: headers.map((h) => h),
    });

    this.writeMetrics({
      stream,
      startDate,
      endDate,
      authHeaders: getAuthFromUser(user),
    });

    return stream;
  }

  private async writeMetrics({
    stream,
    startDate,
    endDate,
    authHeaders,
  }: {
    stream: csv.CsvFormatterStream<csv.Row, csv.Row>;
    startDate: Date;
    endDate: Date;
    authHeaders: HeadersInit;
  }) {
    this.logger.debug(
      `Export startDate: ${startDate.toISOString()}, endDate: ${endDate.toISOString()}`,
    );

    let totalCount = 0;
    let retrievedCount = 0;

    const detector = LanguageDetectorBuilder.fromLanguages(
      'English',
      'French',
      'German',
      'Spanish',
    ).build();

    do {
      const res = await orgHistoryFetcher({
        orgId: this.orgId,
        authHeaders,
        date: {
          start: startDate,
          end: endDate,
        },
        offset: retrievedCount,
        limit: 50,
        orderBy: 'createdAt',
        orderDirection: 'asc',
      });

      totalCount = res.totalCount;
      retrievedCount += res.entries.length;

      for (const entry of res.entries) {
        if (entry.queryStatus !== 'ERROR' && entry.queryStatus !== 'DONE')
          continue;

        const responseDurationMs =
          entry.finishedAt == null
            ? null
            : entry.finishedAt.getTime() - entry.createdAt.getTime();

        const userMetadata = userMetadataSchema.parse(
          entry.user?.metadata ?? {},
        );

        const line: Record<Header, string | number | null | undefined> = {
          query_id: entry.queryId,
          user_id: entry.userId,
          user_email: entry.user?.email,
          user_country: userMetadata.country,
          user_company: userMetadata.company,
          created_at_utc: entry.createdAt.toISOString(),
          finished_at_utc: entry.finishedAt?.toISOString() ?? null,
          response_duration_ms: responseDurationMs,
          status: entry.queryStatus,
          query: entry.query,
          query_language_estimation: detector.detectLanguageOf(entry.query),
          answer: null,
          answer_language_estimation: null,
          error: null,
          sources: null,
          tools: null,
          user_feedbacks: entry.answerUserFeedbacks
            .filter((auf) => auf.evaluation != null)
            .map((auf) => {
              return auf.evaluation === 'NEGATIVE'
                ? -1
                : auf.evaluation === 'DONT_KNOW'
                  ? 0
                  : auf.evaluation === 'POSITIVE'
                    ? 1
                    : null;
            })
            .filter((v) => v != null)
            .join(';'),
          token_prompt: null,
          token_answer: null,
          token_total: null,
          cost_estimation_eur: null,
        };

        if (entry.queryStatus === 'ERROR') {
          line.error = entry.error;
        }

        if (entry.queryStatus === 'DONE') {
          line.answer = entry.answer;
          line.answer_language_estimation = detector.detectLanguageOf(
            entry.answer,
          );

          const response = entry.response;

          line.sources = Array.from(new Set(response.sources))
            .map((elem) => elem.replace(';', '\\;'))
            .join(';');
          line.tools = response.used_tools
            .map((tool) => toolTypeToName(tool.split(':')[0]))
            .map((elem) => elem.replace(';', '\\;'))
            .join(';');
          // line.token_prompt = response.tokens.prompt;
          // line.token_answer = response.tokens.answer;
          // line.token_total = response.tokens.prompt + response.tokens.answer;
          // TODO not available anymore
          line.token_prompt = 0;
          line.token_answer = 0;
          line.token_total = 0;
          line.cost_estimation_eur = response.estimated_cost;
        }

        stream.write(line);
      }

      this.logger.debug(
        `Export progress: ${totalCount <= 0 ? 100 : Math.round((retrievedCount / totalCount) * 100)}%`,
      );
    } while (retrievedCount < totalCount);

    detector.free();

    stream.end();
  }
}

function toolTypeToName(toolType: string) {
  switch (toolType) {
    case 'get_order_by_reference':
      return 'Order by Reference';
    case 'get_partnumber_from_serialnumber':
      return 'Partnumber From Serialnumber';
    case 'order_search':
      return 'Order Search';
    case 'product_details':
      return 'Variant Details';
    case 'product_documents':
      return 'Document Search';
    case 'product_maintenance':
      return 'Maintenance Information';
    case 'product_search':
      return 'Product Search';
    case 'rag_search':
      return 'Document Search (RAG)';
    case 'slt_search':
      return 'Stock, Lead Time and Price Information';
    case 'get_competitor_alternative':
      return 'Competitor Alternative';
    case 'get_competitor_products':
      return 'Get Competitor Products';
    default:
      return toolType;
  }
}
