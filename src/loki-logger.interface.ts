import { ModuleMetadata } from '@nestjs/common/interfaces';
import { LogLevel } from './loki-logger.enum';

export interface Options {
  app: string;
  host: string;
  userId: string;
  password: string;
  environment?: 'development' | 'production';
  logDev?: boolean;
  logLevel?: LogLevel;
}

export interface OptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Options | Promise<Options>;
  inject?: any[];
}
