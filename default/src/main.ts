import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { patchNestJsSwagger } from 'nestjs-zod';
import * as rfs from 'rotating-file-stream';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { AllExceptionsFilter } from './errors';
import { LoggingInterceptor } from './logging';
import { ValidationPipe } from './validation';
import path = require('path');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.appConfig();
  const logger = new Logger();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

  const accessLogStream = rfs.createStream('access.log', {
    maxSize: '10M',
    size: '10M',
    interval: '1d', // rotate daily
    path: path.join(process.cwd(), 'logs'),
  });
  app.use(morgan('combined', { stream: accessLogStream }));

  patchNestJsSwagger();
  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  logger.log(`listening on port ${appConfig.port}`, 'Application');
  await app.listen(appConfig.port);
}

bootstrap();

//
