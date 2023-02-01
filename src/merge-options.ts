import { LogLevel } from './loki-logger.enum';
import { Options } from './loki-logger.interface';

export default (config: Options): Options => ({
  logDev: false,
  environment: 'production',
  logLevel: LogLevel.verbose,
  ...config,
});
