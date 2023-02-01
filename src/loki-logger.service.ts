import {
  Inject,
  Injectable,
  LoggerService as LglService,
} from '@nestjs/common';
import { Logger, transports, format, createLogger } from 'winston';
import TransportStream from 'winston-transport';
import LokiTransport from 'winston-loki';
import { LOKI_CONFIGURATION } from './loki-logger.constants';
import { Options } from './loki-logger.interface';
import mergeOptions from './merge-options';
import { LogLevel } from './loki-logger.enum';

@Injectable()
export class LokiLoggerService implements LglService {
  logger: Logger;
  constructor(@Inject(LOKI_CONFIGURATION) private readonly config: Options) {
    const mergedConfig = mergeOptions(config);

    const transportArray: TransportStream[] = [
      new transports.Console({
        format: format.combine(format.simple(), format.colorize()),
      }),
    ];

    if (mergedConfig.logDev || mergedConfig.environment === 'production') {
      transportArray.push(
        new LokiTransport({
          host: mergedConfig.host,
          labels: { app: mergedConfig.app },
          json: true,
          basicAuth: `${mergedConfig.userId}:${mergedConfig.password}`,
          format: format.json(),
          replaceTimestamp: true,
          onConnectionError: (err) => console.error(err),
        }),
      );
    }

    this.logger = createLogger({ transports: transportArray });
  }
  log(message: any, ...optionalParams: any[]) {
    if (this.config.logLevel >= LogLevel.log) {
      this.logger.log('log', message, optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]) {
    if (this.config.logLevel >= LogLevel.error) {
      this.logger.error(message, optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    if (this.config.logLevel >= LogLevel.warn) {
      this.logger.warn(message, optionalParams);
    }
  }

  debug?(message: string, ...optionalParams: any[]) {
    if (this.config.logLevel >= LogLevel.debug) {
      this.logger.debug(message, optionalParams);
    }
  }

  verbose?(message: string, ...optionalParams: any[]) {
    if (this.config.logLevel >= LogLevel.verbose) {
      this.logger.info(message, optionalParams);
    }
  }
}
