import { Test, TestingModule } from '@nestjs/testing';
import { LokiLoggerService } from './loki-logger.service';
import { LOKI_CONFIGURATION } from './loki-logger.constants';
import { Options } from './loki-logger.interface';
import LokiTransport from 'winston-loki';
import * as winston from 'winston';
import { createMock } from '@golevelup/ts-jest';

jest.mock('winston-loki');
jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn().mockReturnValue({ options: {} }),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    json: jest.fn(),
    prettyPrint: jest.fn(),
    metadata: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue({
    debug: jest.fn(),
    log: jest.fn(),
  }),
  transports: {
    Console: jest.fn().mockReturnValue({ name: 'console' }),
  },
}));

describe('LokiLoggerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('WHEN initialized THEN should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOKI_CONFIGURATION,
          useValue: {},
        },
        LokiLoggerService,
      ],
    }).compile();
    const service = module.get<LokiLoggerService>(LokiLoggerService);
    expect(service).toBeDefined();
  });

  it('WHEN is environment production THEN LokiTransport should be pushed to the transport array', async () => {
    const options: Options = {
      app: '',
      password: '',
      host: '',
      userId: '',
      environment: 'production',
    };

    await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: options },
        LokiLoggerService,
      ],
    }).compile();
    const loki = createMock<LokiTransport>();
    expect(LokiTransport).toHaveBeenCalledTimes(1);

    expect(winston.createLogger).toHaveBeenCalledWith({
      format: { options: {} },
      transports: [{ name: 'console' }, loki],
    });
  });

  it('WHEN is environment development THEN LokiTransport should not be pushed to the transport array', async () => {
    const options: Options = {
      app: '',
      password: '',
      host: '',
      userId: '',
      environment: 'development',
    };

    await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: options },
        LokiLoggerService,
      ],
    }).compile();

    expect(LokiTransport).toHaveBeenCalledTimes(0);
    expect(winston.createLogger).toHaveBeenCalledWith({
      format: { options: {} },
      transports: [{ name: 'console' }],
    });
  });

  it('WHEN is environment development but logDev is true THEN LokiTransport should be pushed to the transport array', async () => {
    const options: Options = {
      app: '',
      password: '',
      host: '',
      userId: '',
      logDev: true,
      environment: 'development',
    };

    await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: options },
        LokiLoggerService,
      ],
    }).compile();
    const loki = createMock<LokiTransport>();
    expect(LokiTransport).toHaveBeenCalledTimes(1);
    expect(winston.createLogger).toHaveBeenCalledWith({
      format: { options: {} },
      transports: [{ name: 'console' }, loki],
    });
  });

  it('WHEN', async () => {
    const options: Options = {
      app: '',
      password: '',
      host: '',
      userId: '',
      environment: 'production',
    };

    await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: options },
        LokiLoggerService,
      ],
    }).compile();
    const loki = createMock<LokiTransport>();
    expect(LokiTransport).toHaveBeenCalledTimes(1);
    expect(winston.createLogger).toHaveBeenCalledWith({
      format: { options: {} },
      transports: [{ name: 'console' }, loki],
    });
  });

  it('WHEN call info THEN logger should been call with level info and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock: winston.Logger = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.info('log message', { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('info', 'log message', [
      {
        test: 'test prop',
      },
    ]);
  });
  it('WHEN call debug THEN logger should been call with level debug and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.debug('log message', { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('debug', 'log message', [
      {
        test: 'test prop',
      },
    ]);
  });

  it('WHEN call debug with object THEN logger should been call with level debug and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.debug({ message: 'test message' }, { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('debug', 'test message', [
      { message: 'test message' },
      [{ test: 'test prop' }],
    ]);
  });
  it('WHEN call error THEN logger should been call with level error and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.error('log message', { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('error', 'log message', [
      {
        test: 'test prop',
      },
    ]);
  });

  it('WHEN call error with Error instance THEN logger should been call with level error and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.error(new Error('error message'), { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('error', 'error message', [
      { err: new Error('error message') },
      [{ test: 'test prop' }],
    ]);
  });

  it('WHEN call log THEN logger should been call with level info and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.log('log message', { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('info', 'log message', [
      {
        test: 'test prop',
      },
    ]);
  });

  it('WHEN call verbose THEN logger should been call with level verbose and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.verbose('log message', { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('verbose', 'log message', [
      {
        test: 'test prop',
      },
    ]);
  });
  it('WHEN call warn THEN logger should been call with level warn and correct message and properties', async () => {
    const mockCreateLogger = jest.spyOn(winston, 'createLogger');
    const module = await Test.createTestingModule({
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: {} },
        LokiLoggerService,
      ],
    }).compile();
    const loggerMock = mockCreateLogger.mock.results[0].value;
    const service = module.get(LokiLoggerService);
    service.warn('log message', { test: 'test prop' });
    expect(loggerMock.log).toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith('warn', 'log message', [
      {
        test: 'test prop',
      },
    ]);
  });
});
