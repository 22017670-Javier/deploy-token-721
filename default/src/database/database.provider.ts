import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class DatabaseProvider implements OnModuleInit {
  private readonly logger = new Logger(DatabaseProvider.name);
  private readonly sequelize: Sequelize;

  constructor(
    private readonly configService: ConfigService,
    @Inject('MODELS') private readonly models: any[],
  ) {
    const dbConfig = this.configService.dbConfig();
    this.sequelize = new Sequelize({
      dialect: 'postgres',
      logging: (sql: string) => this.logger.log({ sql: sql }),
      ...dbConfig,
    });
    this.sequelize.addModels(this.models);
  }

  async onModuleInit() {
    await this.sequelize.sync();
    this.logger.log('database ready');
  }

  getSequelize() {
    return this.sequelize;
  }
}
