import { Test } from '@nestjs/testing';
import { LokiLoggerModule } from './loki-logger.module';
import * as LokiServiceClasses from './loki-logger.service';
import { LOKI_CONFIGURATION } from './loki-logger.constants';

jest.mock('./loki-logger.service');

describe('GIVEN LokiLoggerModule', () => {
  it('WHEN forRoot THEN should be defined', async () => {
    const options = {
      app: '',
      password: '',
      host: '',
      userId: '',
    };

    const module = await Test.createTestingModule({
      imports: [LokiLoggerModule.forRoot(options)],
    }).compile();

    const config = module.get(LOKI_CONFIGURATION);
    const service = module.get(LokiServiceClasses.LokiLoggerService);
    expect(config).toBe(options);
    expect(module).toBeDefined();
    expect(service).toBeInstanceOf(LokiServiceClasses.LokiLoggerService);
  });

  it('WHEN forRootAsync THEN should be defined', async () => {
    const options = {
      app: '',
      password: '',
      host: '',
      userId: '',
    };

    const module = await Test.createTestingModule({
      imports: [LokiLoggerModule.forRootAsync({ useFactory: () => options })],
    }).compile();

    const config = module.get(LOKI_CONFIGURATION);
    const service = module.get(LokiServiceClasses.LokiLoggerService);
    expect(config).toBe(options);
    expect(module).toBeDefined();

    expect(service).toBeInstanceOf(LokiServiceClasses.LokiLoggerService);
  });
});
