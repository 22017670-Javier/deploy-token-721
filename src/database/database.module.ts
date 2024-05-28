import { DynamicModule } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';

type DatabaseModuleOptions = {
  models: any[];
};

export class DatabaseModule {
  static register({ models }: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      providers: [
        {
          provide: 'MODELS',
          useValue: models,
        },
        DatabaseProvider,
      ],
      exports: [DatabaseProvider],
    };
  }
}
