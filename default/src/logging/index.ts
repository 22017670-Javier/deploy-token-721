import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { Observable, tap } from 'rxjs';
  import { ValidationException } from '../validation';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> {
      const message: any = {};
      message.context = `${context.getClass().name}:${context.getHandler().name}`;
      if (context.getType() === 'http') {
        message.http = {
          request: context.switchToHttp().getRequest<Request>().path,
          body: context.switchToHttp().getRequest<Request>().body,
        };
      }
      return next.handle().pipe(
        tap({
          next: (data) => {
            message.data = data;
            this.logger.log(message);
          },
          error: (error) => {
            message.error = formatErrorMessage(error);
            this.logger.error(message);
          },
        }),
      );
    }
  }
  
  function formatErrorMessage(error: any) {
    switch (true) {
      case error instanceof ValidationException: {
        return {
          name: error.name,
          message: error.message,
          stack: error.stack,
          errors: error.errors,
        };
      }
      case error instanceof Error: {
        return {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      }
      default: {
        return error;
      }
    }
  }
  