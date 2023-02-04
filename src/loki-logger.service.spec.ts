import { Test, TestingModule } from '@nestjs/testing';
import { LokiLoggerService } from './loki-logger.service';

describe('LokiLoggerService', () => {
  let service: LokiLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LokiLoggerService],
    }).compile();

    service = module.get<LokiLoggerService>(LokiLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
