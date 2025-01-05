import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { laravelHttpClientErrorHandlerInterface } from './laravel-http-client-error-handler.interface';

@Injectable()
export class laravelHttpClientErrorHandlerService implements laravelHttpClientErrorHandlerInterface {

  constructor(
    private translate: TranslateService,
  ) {
  }

  /**
   * @inheritDoc
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleError(err: HttpErrorResponse): Observable<HttpResponse<any>> {

    // Provide generic error message if it is not provided by API.
    if (err.error && !err.error.message) {

      if (typeof err.error === 'string') {

        // Since err.error is readonly, here we create a new copy of the err
        // object with the error property set to be an object instead of the
        // string.
        err = Object.assign(err, { error: {} });
      }

      err.error.message = this.translate.instant('BASE_ERROR.API_ERROR');

      const xRequestId = err.headers.get('x-request-id');

      if (xRequestId) {
        err.error.message += ' ' + this.translate.instant('BASE_ERROR.REQUEST_ID', { uuid: xRequestId });
      }

    }

    // fetch error headers before throwing the error object.
    err.headers?.keys();
    return throwError(err);

  }

}
