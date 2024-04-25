import { createMock } from '@golevelup/ts-jest';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createMocks } from 'node-mocks-http';
import { of } from 'rxjs';
import { LokiLoggerService } from './loki-logger.service';
import { LokiRequestLoggingInterceptor } from './loki-request-logger.interceptor';

describe('GIVEN LokiRequestLoggerInterceptor', () => {
  it('WHEN intercept on interceptor is called THEN info should be called', async () => {
    const service = createMock<LokiLoggerService>();
    const { req, res } = createMocks();
    const executionContext = new ExecutionContextHost([req, res]);
    const interceptor = new LokiRequestLoggingInterceptor(service);

    const callHandler = {
      handle() {
        return of(10);
      },
    };

    interceptor.intercept(executionContext, callHandler).subscribe();
    expect(service.info).toHaveBeenCalled();
  });
});
