/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { LoggerService } from "../service/LoggerService";

export class LoggerInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    this.logger.log(`Incoming request: ${method} ${url}`, 'HTTP');

    return next.handle().pipe(
      tap(() =>
        this.logger.log(
          `Request ${method} ${url} handled in ${Date.now() - now}ms`,
          'HTTP',
        ),
      ),
    );
  }
    
}