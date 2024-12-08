import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { appDecamelizeKeys } from '../utils/common.util';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log(
      `\n[${request.method}] ${request.headers.host}${request.originalUrl}`,
    );
    return next.handle().pipe(
      map((data) => {
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

  private documentTransformer(data: any): object {
    return {
      data: appDecamelizeKeys(data.toObject()),
    };
  }

  private arrayTransformer(data: any[]): object {
    return {
      data: appDecamelizeKeys(
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

    return appDecamelizeKeys(response);
  }

  private defaultTransformer(data: any): object {
    return {
      data: data || {},
    };
  }
}
