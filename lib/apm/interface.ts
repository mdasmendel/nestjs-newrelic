import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ApmService } from './service';
import { Observable } from 'rxjs';

export abstract class ApmInterceptorConstructor implements NestInterceptor {
  protected constructor(
    protected readonly apmService: ApmService,
    protected readonly mapFunction?: (request: any) => UserContextKeys,
  ) {}

  public abstract intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>>;
}

export interface UserContextKeys {
  id?: string | number;
  username?: string;
  email?: string;
}

export interface ApmOptions {
  httpUserMapFunction?: (request: any) => UserContextKeys;
}

export interface ApmAsyncOptions {
  useFactory?: (...args: any[]) => Promise<ApmOptions> | ApmOptions;
  inject?: any;
}
