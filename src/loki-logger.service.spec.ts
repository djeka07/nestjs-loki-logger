import { Test, TestingModule } from '@nestjs/testing';
import { LokiLoggingService } from './loki-logger.service';

describe('LokiLoggingService', () => {
  let service: LokiLoggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LokiLoggingService],
    }).compile();

    service = module.get<LokiLoggingService>(LokiLoggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
