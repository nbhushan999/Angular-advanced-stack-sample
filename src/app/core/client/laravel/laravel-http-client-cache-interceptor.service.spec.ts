import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CONFIG, ConfigModule } from '@cloud-ui/config';
import { testSuiteConfiguration } from '@cloud-ui/util/testing';
import { Config, configOptions } from '@identity/config';
import * as cache from 'js-cache';
import { provideMockClass } from '@dxp-web/shared/util/testing';
import { CommandUncacheApiService } from '../../command/bus/command-uncache-api.service';
import { laravelHttpClientCacheInterceptorService } from './laravel-http-client-cache-interceptor.service';
import { laravelHttpClientService } from './laravel-http-client.service';
import { laravelHttpClientTestingModule } from './testing/laravel-http-client-testing.module';

describe('laravelHttpClientCacheInterceptorService', () => {

  let client: laravelHttpClientService;
  let config: Config;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let cmdUncacheApiService: jasmine.SpyObj<CommandUncacheApiService>;

  const expectedBody = { body: true };
  const expectedData = { data: true };

  const aslaravelUrl = (path: string) => {
    return config.laravel.apiUrl + path;
  };

  const isSendingBody = (method: string) => {
    return ['post', 'put', 'patch'].includes(method);
  };

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      imports: [
        laravelHttpClientTestingModule,
        ConfigModule.forRoot(configOptions),
      ],
      providers: [
        provideMockClass(() => CommandUncacheApiService),
        laravelHttpClientService,
        laravelHttpClientCacheInterceptorService,
        { provide: HTTP_INTERCEPTORS, useClass: laravelHttpClientCacheInterceptorService, multi: true },
      ],
    });

    client = TestBed.inject(laravelHttpClientService);
    config = TestBed.inject(CONFIG);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    cmdUncacheApiService = TestBed.inject(CommandUncacheApiService) as typeof cmdUncacheApiService;

  });

  afterEach(() => {

    httpTestingController.verify();

  });

  it('should clear cache on commands', () => {

    const subscribeSpy = jasmine.createSpy('subscribeSpy');
    client.get('/test').subscribe(subscribeSpy);

    const req = httpTestingController.match(aslaravelUrl('/test'));

    req[0].flush(expectedData);

    expect(cmdUncacheApiService.clearCacheOnCommands).toHaveBeenCalled();

    cache.clear();

  });

  describe('intercept', () => {

    it('should intercept get request', () => {

      const subscribeSpy = jasmine.createSpy('subscribeSpy');

      client.get('/test').subscribe(subscribeSpy);
      client.get('/test').subscribe(subscribeSpy);
      client.get('/test').subscribe(subscribeSpy);

      const req1 = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req1.request.method).toEqual('GET');

      req1.flush(expectedData);

      expect(subscribeSpy.calls.count()).toBe(3);

      expect(subscribeSpy.calls.argsFor(0)).toEqual([expectedData]);
      expect(subscribeSpy.calls.argsFor(1)).toEqual([expectedData]);
      expect(subscribeSpy.calls.argsFor(2)).toEqual([expectedData]);

      cache.clear();

      client.get('/test').subscribe(subscribeSpy);

      const req2 = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req2.request.method).toEqual('GET');

      req2.flush(expectedData);

      expect(subscribeSpy.calls.count()).toBe(4);

      expect(subscribeSpy.calls.argsFor(3)).toEqual([expectedData]);

    });

    it('should intercept options request', () => {

      const subscribeSpy = jasmine.createSpy('subscribeSpy');

      client.options('/test').subscribe(subscribeSpy);
      client.options('/test').subscribe(subscribeSpy);
      client.options('/test').subscribe(subscribeSpy);

      const req1 = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req1.request.method).toEqual('OPTIONS');

      req1.flush(expectedData);

      expect(subscribeSpy.calls.count()).toBe(3);

      expect(subscribeSpy.calls.argsFor(0)).toEqual([expectedData]);
      expect(subscribeSpy.calls.argsFor(1)).toEqual([expectedData]);
      expect(subscribeSpy.calls.argsFor(2)).toEqual([expectedData]);

      cache.clear();

      client.options('/test').subscribe(subscribeSpy);

      const req2 = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req2.request.method).toEqual('OPTIONS');

      req2.flush(expectedData);

      expect(subscribeSpy.calls.count()).toBe(4);

      expect(subscribeSpy.calls.argsFor(3)).toEqual([expectedData]);

    });

    it('should not intercept get request if `X-laravel-Http-Client-Cache` is `no-cache`', () => {

      const subscribeSpy = jasmine.createSpy('subscribeSpy');

      client.get('/test', { cache: false }).subscribe(subscribeSpy);
      client.get('/test', { cache: false }).subscribe(subscribeSpy);
      client.get('/test', { cache: false }).subscribe(subscribeSpy);

      const req = httpTestingController.match(aslaravelUrl('/test'));

      expect(req.length).toBe(3);

      expect(req[0].request.method).toEqual('GET');
      expect(req[1].request.method).toEqual('GET');
      expect(req[2].request.method).toEqual('GET');

      req[0].flush(expectedData);
      req[1].flush(expectedData);
      req[2].flush(expectedData);

      expect(subscribeSpy.calls.argsFor(0)).toEqual([expectedData]);
      expect(subscribeSpy.calls.argsFor(1)).toEqual([expectedData]);
      expect(subscribeSpy.calls.argsFor(2)).toEqual([expectedData]);

      expect(subscribeSpy.calls.count()).toBe(3);

    });

    ['post', 'put', 'patch', 'head', 'delete'].forEach((method) => {

      it(`should not intercept ${method} request from client`, () => {

        const subscribeSpy = jasmine.createSpy('subscribeSpy');

        if (isSendingBody(method)) {
          client[method]('/test', expectedBody).subscribe(subscribeSpy);
          client[method]('/test', expectedBody).subscribe(subscribeSpy);
          client[method]('/test', expectedBody).subscribe(subscribeSpy);
        } else {
          client[method]('/test').subscribe(subscribeSpy);
          client[method]('/test').subscribe(subscribeSpy);
          client[method]('/test').subscribe(subscribeSpy);
        }

        const req = httpTestingController.match(aslaravelUrl('/test'));

        expect(req.length).toBe(3);

        expect(req[0].request.method).toEqual(method.toLocaleUpperCase());
        expect(req[1].request.method).toEqual(method.toLocaleUpperCase());
        expect(req[2].request.method).toEqual(method.toLocaleUpperCase());

        if (isSendingBody(method)) {
          expect(req[0].request.body).toEqual(expectedBody);
          expect(req[1].request.body).toEqual(expectedBody);
          expect(req[2].request.body).toEqual(expectedBody);
        }

        req[0].flush(expectedData);
        req[1].flush(expectedData);
        req[2].flush(expectedData);

        expect(subscribeSpy.calls.argsFor(0)).toEqual([expectedData]);
        expect(subscribeSpy.calls.argsFor(1)).toEqual([expectedData]);
        expect(subscribeSpy.calls.argsFor(2)).toEqual([expectedData]);

        expect(subscribeSpy.calls.count()).toBe(3);

      });

    });

    ['get', 'post', 'put', 'patch', 'head', 'options', 'delete'].forEach((method) => {

      it(`should not intercept ${method} request from http client`, () => {

        const subscribeSpy = jasmine.createSpy('subscribeSpy');

        if (isSendingBody(method)) {
          httpClient[method]('/test', expectedBody).subscribe(subscribeSpy);
          httpClient[method]('/test', expectedBody).subscribe(subscribeSpy);
          httpClient[method]('/test', expectedBody).subscribe(subscribeSpy);
        } else {
          httpClient[method]('/test').subscribe(subscribeSpy);
          httpClient[method]('/test').subscribe(subscribeSpy);
          httpClient[method]('/test').subscribe(subscribeSpy);
        }

        const req = httpTestingController.match('/test');

        expect(req.length).toBe(3);

        expect(req[0].request.method).toEqual(method.toLocaleUpperCase());
        expect(req[1].request.method).toEqual(method.toLocaleUpperCase());
        expect(req[2].request.method).toEqual(method.toLocaleUpperCase());

        if (isSendingBody(method)) {
          expect(req[0].request.body).toEqual(expectedBody);
          expect(req[1].request.body).toEqual(expectedBody);
          expect(req[2].request.body).toEqual(expectedBody);
        }

        req[0].flush(expectedData);
        req[1].flush(expectedData);
        req[2].flush(expectedData);

        expect(subscribeSpy.calls.argsFor(0)).toEqual([expectedData]);
        expect(subscribeSpy.calls.argsFor(1)).toEqual([expectedData]);
        expect(subscribeSpy.calls.argsFor(2)).toEqual([expectedData]);

        expect(subscribeSpy.calls.count()).toBe(3);

      });

    });

  });

});
