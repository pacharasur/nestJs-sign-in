import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { decodeJwtHeaders } from './tools';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionMessage');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse()['message'] || exception.message;
    const code = exception.getResponse()['statusCode'] || exception.getResponse()['code'];

    const exceptionMessage = this.transformMessageHandler(message);

    const decoded = decodeJwtHeaders(request.headers.authorization);

    if (decoded) {
      this.logger.error(
        `An error occured on user ${decoded.username} when call ${request.url} - ${exceptionMessage}`,
      );
    } else {
      this.logger.error(
        `An error occured on unknown user when call ${request.url} - ${exceptionMessage}`,
      );
    }

    response.status(status).json({
      result: false,
      message: message,
      code: code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  transformMessageHandler(message: any): string {
    if(Array.isArray(message)) {
      return message.join(', ');
    } else {
      return message;
    }
  }
}
