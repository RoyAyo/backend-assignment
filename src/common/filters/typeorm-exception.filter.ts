import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
@Catch(EntityNotFoundError)
export class TypeormExceptionFilter<T> implements ExceptionFilter {
  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode: HttpStatus;
    let message: string;

    if (exception instanceof QueryFailedError) {
      // could further break this down to foreign constraint and all
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Unable to process Request'; 
    } else if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }
    console.error('error', exception);

    response.status(statusCode).json({
      statusCode: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
