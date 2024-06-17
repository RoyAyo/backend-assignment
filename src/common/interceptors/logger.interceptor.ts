import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    console.log('...', req.url, '...', new Date().toISOString(), '...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Time taken... ${Date.now() - now}ms`)));
  }
}
