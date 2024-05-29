import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import {
  TokenModel,
  TokenRepository,
} from '../src/services/Token/token.model';
import { TokenService } from '../src/services/Token/token.service';
import { TokenController } from '../src/controllers/Token/token.controller';

const models: any[] = [TokenModel];
const modules: any[] = [];

const repositories: any[] = [TokenRepository];
const services: any[] = [TokenService];

const controllers: any[] = [TokenController];
@Module({
  imports: [
    ConfigModule,
    DatabaseModule.register({ models }),
    HttpModule,
    ...modules,
  ],
  providers: [...repositories, ...services],
  controllers: controllers,
})
export class AppModule {}
