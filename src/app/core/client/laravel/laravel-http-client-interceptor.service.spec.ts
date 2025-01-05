import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CONFIG, ConfigModule } from '@cloud-ui/config';
import { provideMockClass } from '@cloud-ui/util/testing';
import { Config, configOptions } from '@identity/config';
import { CookieService } from 'ngx-cookie-service';
import { SESSION_STORAGE } from 'ngx-webstorage-service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@dxp-web/cx/identity/auth';
import { laravelHttpClientErrorHandlerService } from './laravel-http-client-error-handler.service';
import { laravelHttpClientInterceptorService } from './laravel-http-client-interceptor.service';
import { laravelHttpClientService } from './laravel-http-client.service';
import { laravelHttpClientTestingModule } from './testing/laravel-http-client-testing.module';

describe('laravelHttpClientInterceptorService', () => {

  let client: laravelHttpClientService;
  let authService: AuthService;
  let config: Config;
  let clientErrorHandler: laravelHttpClientErrorHandlerService;
  const getAccessToken$ = new BehaviorSubject('token123');
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const expectedData = { data: true };
  let cookieService: jasmine.SpyObj<CookieService>;

  const aslaravelUrl = (path: string) => {
    return config.laravel.apiUrl + path;
  };

  const storageMock = {
    set() {},
    get() {},
    remove() {},
  };

  const authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getAccessToken$']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        laravelHttpClientTestingModule,
        ConfigModule.forRoot(configOptions),
      ],
      providers: [

        // Services.
        laravelHttpClientService,
        provideMockClass(() => CookieService),
        { provide: SESSION_STORAGE, useValue: storageMock },
        { provide: AuthService, useValue: authSpy },

        // Interceptors.
        { provide: HTTP_INTERCEPTORS, useClass: laravelHttpClientInterceptorService, multi: true },

      ],
    });
  });

  beforeEach(() => {

    config = TestBed.inject(CONFIG) as typeof config;
    authService = TestBed.inject(AuthService) as typeof authService;
    client = TestBed.inject(laravelHttpClientService) as typeof client;
    clientErrorHandler = TestBed.inject(laravelHttpClientErrorHandlerService) as typeof clientErrorHandler;
    httpClient = TestBed.inject(HttpClient) as typeof httpClient;
    httpTestingController = TestBed.inject(HttpTestingController) as typeof httpTestingController;
    cookieService = TestBed.inject(CookieService) as typeof cookieService;

    authSpy.getAccessToken$.and.returnValue(getAccessToken$.asObservable());

  });

  afterEach(() => {

    httpTestingController.verify();

  });

  describe('intercept', () => {

    it('should intercept laravel requests', () => {

      client.get('/test').subscribe(data => expect(data).toEqual(expectedData));

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req.request.headers.get('Authorization')).toEqual('Bearer token123');

      req.flush(expectedData);

    });

    it('should intercept only once', () => {

      const subscribeSpy = jasmine.createSpy('subscribeSpy');

      client.get('/test').subscribe(subscribeSpy);

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      req.flush(expectedData);

      getAccessToken$.next('token456');

      expect(subscribeSpy.calls.count()).toBe(1);

    });

    it('should intercept and handle error', () => {

      const subscribeSpy = jasmine.createSpy('subscribeSpy');

      spyOn(clientErrorHandler, 'handleError').and.callThrough();

      client.get('/test').subscribe(
        subscribeSpy,
        (err: HttpErrorResponse) => {
          expect(err.error).toEqual(expectedData, 'error');
          expect(err.status).toEqual(403, 'status');
          expect(err.statusText).toEqual('Access denied', 'statusText');
          expect(clientErrorHandler.handleError).toHaveBeenCalledWith(err);
        },
      );

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      req.flush(expectedData, { status: 403, statusText: 'Access denied' });

      expect(subscribeSpy).not.toHaveBeenCalled();

    });

    it('should not intercept', () => {

      httpClient.get('https://cloud.acquia.com/test').subscribe(data => expect(data).toEqual(expectedData));

      const req = httpTestingController.expectOne('https://cloud.acquia.com/test');

      expect(req.request.headers.get('Authorization')).toBeNull();

      req.flush(expectedData);

    });

  });

});
