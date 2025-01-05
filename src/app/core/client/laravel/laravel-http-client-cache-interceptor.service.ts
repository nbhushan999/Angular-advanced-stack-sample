import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONFIG } from '@cloud-ui/config';
import { Config } from '@identity/config';
import * as cache from 'js-cache';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CommandUncacheApiService } from '../../command/bus/command-uncache-api.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable()
export class laravelHttpClientCacheInterceptorService implements HttpInterceptor {

  private cacheTTL = 5 * 60 * 1000;

  constructor(
    @Inject(CONFIG) protected config: Config,
    private readonly commandUnchcaceApiService: CommandUncacheApiService,
  ) {
    this.commandUnchcaceApiService.clearCacheOnCommands();
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.shouldInterceptRequest(req)) {

      let handler = cache.get(req.method + ':' + req.urlWithParams);

      if (handler) {
        return handler;
      }

      handler = next.handle(req).pipe(
        shareReplay(1),
      );

      cache.set(req.method + ':' + req.urlWithParams, handler, this.cacheTTL);

      return handler;

    }

    // Remove X-laravel-Http-Client-Cache header. This header is not meant to be sent
    // to the backend. Its only purpose is to tell this interceptor to skip
    // caching the request.
    req = req.clone({
      headers: req.headers.delete('X-laravel-Http-Client-Cache'),
    });

    return next.handle(req);

  }

  protected shouldInterceptRequest(req: HttpRequest<any>): boolean {

    if (req.headers.get('X-laravel-Http-Client-Cache') === 'no-cache') {
      return false;
    }

    // Only cache GET and OPTIONS
    if (!(req.method.includes('GET') || req.method.includes('OPTIONS'))) {
      return;
    }

    if (req.url.includes(this.config.laravel.apiUrl)) {
      return true;
    }

    return false;

  }

}
