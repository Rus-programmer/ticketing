import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { LoggerService } from '../utils/logger/logger.service';

@Catch(RpcException)
export class RpcExFilter implements RpcExceptionFilter<RpcException> {
  constructor(private logger: LoggerService) {
    logger.setContext(RpcExFilter.name);
  }

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    this.logger.error(error);
    return throwError(() => error);
  }
}
