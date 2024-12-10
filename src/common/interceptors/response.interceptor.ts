import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { appCamelizeKeys } from '../utils/common.util';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly activityLogsService: ActivityLogsService
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log(
      `\n[${request.method}] ${request.headers.host}${request.originalUrl}`,
    );
    return next.handle().pipe(
      map(async (data) => {
        // await this.activityLogsService.createActivityLog(userId, method, url, 200, timestamp);
        const response: any = this.transformResponseHandler(data?.data || data);
        return response;
      }),
    );
  }

  private transformResponseHandler(data: any = {}) {
    let response: any;
    if (Array.isArray(data)) {
      response = this.arrayTransformer(data);
    } else if (data?.accessToken) {
      response = this.tokenTransformer(data);
    } else if (typeof data === 'boolean') {
      response = {
        data,
      };
    } else {
      response = this.defaultTransformer(data);
    }

    return {
      result: true,
      message: 'Success',
      timestamp: new Date().toISOString(),
      ...response,
    };
  }

  private arrayTransformer(data: any[]): object {
    return {
      data: appCamelizeKeys(
        data.map((doc) => (!doc.toObject ? doc : doc.toObject())),
      ),
    };
  }

  private tokenTransformer(data: any): object {
    const { expiresIn, accessToken, ...information } = data;
    const response = {
      data: information,
      expiresIn,
      accessToken,
    };

    return appCamelizeKeys(response);
  }

  private defaultTransformer(data: any): object {
    return {
      data: appCamelizeKeys(data) || {},
    };
  }
}
