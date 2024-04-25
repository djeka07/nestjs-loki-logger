/* eslint-disable @typescript-eslint/no-explicit-any */
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
import createLogFormat from './create-log-format';
import onConnectionError from './on-connection-error';

@Injectable()
export class LokiLoggerService implements LglService {
  private logger: Logger;
  constructor(@Inject(LOKI_CONFIGURATION) private readonly config: Options) {
    const mergedConfig = mergeOptions(config);
    const logFormat = format.printf(createLogFormat);

    const transportArray: TransportStream[] = [
      new transports.Console({
        format: format.combine(format.colorize(), logFormat),
      }),
    ];

    if (mergedConfig.logDev || mergedConfig.environment === 'production') {
      transportArray.push(
        new LokiTransport({
          host: mergedConfig.host,
          level: LogLevel[mergedConfig.logLevel],
          labels: { app: mergedConfig.app },
          json: true,
          basicAuth: `${mergedConfig.userId}:${mergedConfig.password}`,
          format: format.combine(format.prettyPrint(), format.json()),
          replaceTimestamp: true,
          onConnectionError,
        }),
      );
    }

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        }),
      ),
      transports: transportArray,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.info, message, optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.info, message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.error, message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.warn, message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.debug, message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.verbose, message, optionalParams);
  }

  private call(level: LogLevel, message: any, ...optionalParams: any[]) {
    const objArg: Record<string, any> = {};

    if (typeof message === 'object') {
      if (message instanceof Error) {
        objArg.err = message;
      } else {
        Object.assign(objArg, message);
      }
      this.logger.log(LogLevel[level], message?.message || '', [
        objArg,
        ...(optionalParams || []),
      ]);
    } else {
      this.logger.log(LogLevel[level], message, ...(optionalParams || []));
    }
  }
}
