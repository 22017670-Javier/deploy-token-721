import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as types from './config.types';

const DEVELOPMENT_CONFIG_PATH = 'config/development.json';
const CONFIG_PATH = 'config/config.json';

@Injectable()
export class ConfigService {
  readonly development: boolean;
  private readonly config: any;

  constructor() {
    this.development =
      process.env.APP_ENV !== undefined &&
      process.env.APP_ENV.toLowerCase() === 'development';

    const configFile = readFileSync(
      this.development ? DEVELOPMENT_CONFIG_PATH : CONFIG_PATH,
    ).toString();
    this.config = JSON.parse(configFile);
  }

  appConfig(): types.AppConfig {
    return types.appConfigSchema.parse(this.config.app);
  }

  jwtConfig(): types.JwtConfig {
    return types.jwtConfigSchema.parse(this.config.jwt);
  }

  dbConfig(): types.DbConfig {
    return types.dbConfigSchema.parse(this.config.postgres);
  }

  awsConfig(): types.AwsConfig {
    return types.awsConfigSchema.parse(this.config.aws);
  }

  sqsConfig(): types.SqsConfig {
    return types.sqsConfigSchema.parse(this.config.sqs);
  }

  redisConfig(): types.RedisConfig {
    return types.redisConfigSchema.parse(this.config.redis);
  }

  rmqConfig(): types.RmqConfig {
    return types.rmqConfigSchema.parse(this.config.rmq);
  }

  servicesConfig(): types.ServicesConfig {
    return types.servicesConfigSchema.parse(this.config.services);
  }
}
