import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';
import { decodeJwtHeaders } from '../exception/tools';

@Injectable()
export class logsInterceptor implements NestInterceptor {
  constructor(
    private readonly activityLogsService: ActivityLogsService
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const decoded = decodeJwtHeaders(request.headers.authorization);
    const username = decoded ? decoded.username : 'unknown user';
    return next.handle().pipe(
      tap(async () => {
        const res = context.switchToHttp().getResponse<Response>();
        console.log(username);
        await this.activityLogsService.createActivityLog(username, request.method, request.originalUrl, res.statusCode, 'Success');
        return next.handle();
      }),
    );
  }
}
