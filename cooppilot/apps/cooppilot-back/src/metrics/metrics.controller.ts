import { CurrentUser } from '@/user/currentUser.decorator';
import { User } from '@/user/user.type';
import { ZodValidationPipe } from '@/ZodValidationPipe';
import {
  Controller,
  Get,
  Query,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { MetricsService } from './metrics.service';

const metricsQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  standardFormat: z.preprocess(
    (v) => (typeof v === 'boolean' ? v : v === 'true' || v === '1'),
    z.boolean(),
  ),
});
type MetricsQuery = z.infer<typeof metricsQuerySchema>;

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(
    @Query(new ZodValidationPipe(metricsQuerySchema))
    queryParams: MetricsQuery,
    @CurrentUser() user: User | null,
  ) {
    if (user == null) throw new UnauthorizedException('no user');

    return new StreamableFile(
      this.metricsService.getMetricsCsvStream(queryParams, user),
      {
        type: 'text/csv',
        disposition: 'attachment; filename="metrics.csv"',
      },
    );
  }
}
