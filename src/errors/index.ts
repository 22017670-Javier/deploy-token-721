import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { BaseResponse } from 'src/base/base-response';
import { ValidationException } from '../validation';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.getType<'http' | 'rmq'>();
    if (ctx === 'rmq') {
      throw new RpcException(exception);
    }
    if (ctx === 'http') {
      httpExceptionFilter(exception, host);
    }
  }
}

function httpExceptionFilter(exception: any, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  let status = 500;
  const responseJson: BaseResponse = {
    success: false,
    message: 'internal server error',
  };

  switch (true) {
    case exception instanceof ValidationException: {
      responseJson.message = 'validation error';
      responseJson.data = {
        errors: exception.errors,
      };
      status = 400;
      break;
    }
    case exception instanceof HttpException: {
      responseJson.message = exception.message;
      responseJson.data = exception.getResponse();
      status = exception.getStatus();
      break;
    }
    case exception instanceof Error: {
      responseJson.data = {
        name: exception.name,
        message: exception.message,
      };
      break;
    }
  }

  response.status(status).json(responseJson);
  return;
}
