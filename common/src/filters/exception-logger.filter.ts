import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggerService } from '../utils/logger/logger.service';

@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter {
  constructor(private logger: LoggerService) {
    super();
    logger.setContext(ExceptionLoggerFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(JSON.stringify(message));

    super.catch(exception, host);
  }
}
