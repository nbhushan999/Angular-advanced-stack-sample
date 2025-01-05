import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CONFIG, ConfigModule } from '@cloud-ui/config';
import { testSuiteConfiguration } from '@cloud-ui/util/testing';
import { Config, configOptions } from '@identity/config';
import { laravelHttpClientService } from './laravel-http-client.service';
import { laravelHttpClientTestingModule } from './testing';

describe('laravelHttpClientService', () => {

  let config: Config;
  let client: laravelHttpClientService;
  let httpTestingController: HttpTestingController;
  const expectedData = { data: true };
  const expectedBody = { body: true };
  const expectedOptions = { params: { test: 'test' }, headers: { 'Test': 'Test' } };
  const subscribeSpy = jasmine.createSpy('subscribeSpy');

  const isSendingBody = (method: string) => {
    return ['post', 'put', 'patch'].includes(method);
  };

  const aslaravelUrl = (path: string) => {
    return config.laravel.apiUrl + path;
  };

  testSuiteConfiguration(() => {

    TestBed.configureTestingModule({
      imports: [
        laravelHttpClientTestingModule,
        ConfigModule.forRoot(configOptions),
      ],
      providers: [
        laravelHttpClientService,
      ],
    });

    client = TestBed.inject(laravelHttpClientService) as typeof client;
    config = TestBed.inject(CONFIG) as typeof config;
    httpTestingController = TestBed.inject(HttpTestingController) as typeof httpTestingController;

  });

  afterEach(() => {

    httpTestingController.verify();

  });

  ['get', 'post', 'patch', 'put', 'delete', 'head', 'options'].forEach((method) => {

    it('should set api version', () => {

      if (isSendingBody(method)) {
        client[method]('/test', expectedBody).subscribe(subscribeSpy);
      } else {
        client[method]('/test').subscribe(subscribeSpy);
      }

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req.request.headers.get('Accept')).toEqual('application/json, version=2');
      expect(req.request.method).toEqual(method.toUpperCase());

      if (isSendingBody(method)) {
        expect(req.request.body).toEqual(expectedBody);
      }

      req.flush(expectedData);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    });

    it('should set api version override', () => {

      if (isSendingBody(method)) {
        client[method]('/test', expectedBody, { apiVersion: '3' }).subscribe(subscribeSpy);
      } else {
        client[method]('/test', { apiVersion: '3' }).subscribe(subscribeSpy);
      }

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req.request.headers.get('Accept')).toEqual('application/json, version=3');
      expect(req.request.method).toEqual(method.toUpperCase());

      if (isSendingBody(method)) {
        expect(req.request.body).toEqual(expectedBody);
      }

      req.flush(expectedData);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    });

    it('should override api url', () => {

      if (isSendingBody(method)) {
        client[method]('/test', expectedBody, { api: { apiUrl: 'https://test-service.acquia.test' } }).subscribe(subscribeSpy);
      } else {
        client[method]('/test', { api: { apiUrl: 'https://test-service.acquia.test' } }).subscribe(subscribeSpy);
      }

      const req = httpTestingController.expectOne('https://test-service.acquia.test/test');

      expect(req.request.headers.get('Accept')).toEqual('application/json, version=2');
      expect(req.request.method).toEqual(method.toUpperCase());

      if (isSendingBody(method)) {
        expect(req.request.body).toEqual(expectedBody);
      }

      req.flush(expectedData);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    });

    it('should set parameters and headers', () => {

      if (isSendingBody(method)) {
        client[method]('/test', expectedBody, expectedOptions).subscribe(subscribeSpy);
      } else {
        client[method]('/test', expectedOptions).subscribe(subscribeSpy);
      }

      const req = httpTestingController.expectOne(aslaravelUrl('/test?test=test'));

      expect(req.request.headers.get('Test')).toEqual('Test');
      expect(req.request.params.get('test')).toEqual('test');
      expect(req.request.method).toEqual(method.toUpperCase());

      if (isSendingBody(method)) {
        expect(req.request.body).toEqual(expectedBody);
      }

      req.flush(expectedData);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    });

    it('should set `X-laravel-Http-Client-Cache` `no-cache` header', () => {

      if (isSendingBody(method)) {
        client[method]('/test', expectedBody, { cache: false }).subscribe(subscribeSpy);
      } else {
        client[method]('/test', { cache: false }).subscribe(subscribeSpy);
      }

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req.request.headers.get('X-laravel-Http-Client-Cache')).toEqual('no-cache');
      expect(req.request.method).toEqual(method.toUpperCase());

      if (isSendingBody(method)) {
        expect(req.request.body).toEqual(expectedBody);
      }

      req.flush(expectedData);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    });

    it('should not set `X-laravel-Http-Client-Cache` `no-cache` header', () => {

      if (isSendingBody(method)) {
        client[method]('/test', expectedBody, { cache: true }).subscribe(subscribeSpy);
      } else {
        client[method]('/test', { cache: true }).subscribe(subscribeSpy);
      }

      const req = httpTestingController.expectOne(aslaravelUrl('/test'));

      expect(req.request.headers.get('X-laravel-Http-Client-Cache')).toBeNull();
      expect(req.request.method).toEqual(method.toUpperCase());

      if (isSendingBody(method)) {
        expect(req.request.body).toEqual(expectedBody);
      }

      req.flush(expectedData);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    });

  });

});
