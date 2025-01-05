import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { laravelHttpClientErrorHandlerInterface } from '../laravel-http-client-error-handler.interface';

/**
 * Provides Mock laravel Http Client Error Handler Testing Service.
 *
 */
@Injectable()
export class laravelHttpClientErrorHandlerTestingService implements laravelHttpClientErrorHandlerInterface {

  constructor() {
  }

  /**
   * @inheritDoc
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleError(err: HttpErrorResponse): Observable<HttpResponse<any>> {

    return throwError(err);

  }

}
