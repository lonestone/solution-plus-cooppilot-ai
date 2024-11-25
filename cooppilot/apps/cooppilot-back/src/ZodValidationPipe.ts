import {
  ArgumentMetadata,
  BadRequestException,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      // this.logger.debug(`value: ${JSON.stringify(value)}`);
      return this.schema.parse(value);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Validation failed');
    }
  }
}
