import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslationTestingModule } from '../../testing/translation-testing.module';
import { laravelHttpClientErrorHandlerService } from './laravel-http-client-error-handler.service';

describe('laravelHttpClientErrorHandlerService', () => {

  let errorHandler: laravelHttpClientErrorHandlerService;
  let successSpy: jasmine.Spy;
  let failureSpy: jasmine.Spy;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        TranslationTestingModule,
        RouterTestingModule,
      ],
      providers: [
        laravelHttpClientErrorHandlerService,
        TranslateService,
      ],
    });

    errorHandler = TestBed.inject(laravelHttpClientErrorHandlerService) as typeof errorHandler;

  });

  beforeEach(() => {

    successSpy = jasmine.createSpy('successSpy');
    failureSpy = jasmine.createSpy('failureSpy');

  });

  describe('handleError', () => {

    it('should handle error', () => {

      const res = new HttpErrorResponse({ error: { message: 'API call has failed' } });

      errorHandler.handleError(res).subscribe(
        successSpy,
        failureSpy,
      );

      expect(successSpy).not.toHaveBeenCalled();
      expect(failureSpy).toHaveBeenCalledWith(res);

    });

    it('should provide generic error message with request id when error message is not provided by API', () => {

      const headers = new HttpHeaders({ 'x-request-id': 'uuid' });
      const res = new HttpErrorResponse({ error: { }, headers });

      errorHandler.handleError(res).subscribe(
        successSpy,
        failureSpy,
      );

      expect(failureSpy).toHaveBeenCalledWith(new HttpErrorResponse({ error: { message: 'BASE_ERROR.API_ERROR BASE_ERROR.REQUEST_ID' }, headers }));

    });

    it('should provide generic error message without request id when it is not available', () => {

      const headers = new HttpHeaders({});
      const res = new HttpErrorResponse({ error: { }, headers });

      errorHandler.handleError(res).subscribe(
        successSpy,
        failureSpy,
      );

      expect(failureSpy).toHaveBeenCalledWith(new HttpErrorResponse({ error: { message: 'BASE_ERROR.API_ERROR' }, headers }));

    });

    it('should provide generic error message when error is a string', () => {

      const headers = new HttpHeaders({});
      const res = new HttpErrorResponse({ error: ' ', headers });

      errorHandler.handleError(res).subscribe(
        successSpy,
        failureSpy,
      );

      expect(failureSpy).toHaveBeenCalledWith(new HttpErrorResponse({ error: { message: 'BASE_ERROR.API_ERROR' }, headers }));

    });

  });

});
