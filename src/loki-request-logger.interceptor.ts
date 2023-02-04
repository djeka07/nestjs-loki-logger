import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LokiLoggerService } from './loki-logger.service';

@Injectable()
export class LokiRequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LokiLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = new Date().getTime();

    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const end = new Date().getTime();
        const elapsedMs = end - start;

        this.loggerService.info(
          `${req.method} ${req.originalUrl} ${elapsedMs}ms ${res.statusCode} ${
            req.get('x-request-id') || '-'
          }`,
        );
      }),
    );
  }
}
