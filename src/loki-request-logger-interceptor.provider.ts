import { APP_INTERCEPTOR } from '@nestjs/core';
import { LokiRequestLoggingInterceptor } from './loki-request-logger.interceptor';

export const LokiRequestLoggerInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LokiRequestLoggingInterceptor,
};
