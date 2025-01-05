import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONFIG } from '@cloud-ui/config';
import { Config } from '@identity/config';
import { CookieService } from 'ngx-cookie-service';
import { Observable, combineLatest } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '@dxp-web/cx/identity/auth';
import { laravelHttpClientErrorHandlerService } from './laravel-http-client-error-handler.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable()
export class laravelHttpClientInterceptorService implements HttpInterceptor {

  constructor(
    @Inject(CONFIG) protected config: Config,
    @Inject(laravelHttpClientErrorHandlerService) protected errorHandler: laravelHttpClientErrorHandlerService,
    private auth: AuthService,
    protected cookieService: CookieService,
  ) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const observables = [
      this.auth.getAccessToken$(),
    ];

    return combineLatest(observables).pipe(

      take(1),

      switchMap(data => {

        let token: string | null = null;
        token = data[0];

        // @todo: Used for testing purpose only. To be removed after https://github.com/acquia/network-accounts/pull/685 is merged.
        // token = [paste token value here]

        // Determine if this request should be intercepted.
        if (this.shouldIntercept(req)) {

          // Determine if token is set, if so then send the authorization
          // header with the token.
          if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
          }

        }

        // Handle the request and handle any errors.
        return next.handle(req).pipe(
          catchError((err: HttpErrorResponse) => this.errorHandler.handleError(err)),
        );

      }),

    );

  }

  protected shouldIntercept(req: HttpRequest<any>): boolean {

    if (req.url.toLocaleLowerCase().includes(this.config.laravel.apiUrl)) {
      return true;
    }

    return false;

  }

}
