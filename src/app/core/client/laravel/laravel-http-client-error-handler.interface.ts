import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface laravelHttpClientErrorHandlerInterface {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(res: HttpErrorResponse): Observable<HttpResponse<any>>;

}
