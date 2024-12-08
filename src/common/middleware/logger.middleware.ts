import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  /**
   * This method is called every time a request is made to the server
   * It logs information about the request, such as IP address, method, URL, user agent, status code, and content length
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @param {NextFunction} next - A callback function that is called when the middleware is done processing the request.
   * @returns void
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Extract the IP address, method, and URL from the request object
    const { ip, method, originalUrl } = req;

    // Get the user agent from the request headers, or set an empty string if it's not present
    const userAgent = req.get('user-agent') || '';

    // When the response is finished, log the relevant information
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      // Log the request information using the logger instance
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    // If all checks passed, call the next middleware or controller
    next();
  }
}
