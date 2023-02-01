import { Module, Provider } from '@nestjs/common';
import { LOKI_CONFIGURATION } from './loki-logger.constants';
import { Options, OptionsAsync } from './loki-logger.interface';
import { LokiLoggerService } from './loki-logger.service';

@Module({})
export class LokiLoggerModule {
  public static forRoot(config: Options) {
    return {
      module: LokiLoggerModule,
      providers: [
        { provide: LOKI_CONFIGURATION, useValue: config },
        LokiLoggerService,
      ],
      exports: [LokiLoggerService],
    };
  }

  public static forAsyncRoot(config: OptionsAsync) {
    return {
      module: LokiLoggerModule,
      imports: config.imports || [],
      providers: [this.createAsyncProviders(config), LokiLoggerService],
      exports: [LokiLoggerService],
    };
  }

  private static createAsyncProviders(options: OptionsAsync): Provider {
    return {
      provide: LOKI_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
