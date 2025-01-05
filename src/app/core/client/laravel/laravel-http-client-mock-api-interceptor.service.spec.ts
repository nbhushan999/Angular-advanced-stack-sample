import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CONFIG, ConfigModule } from '@cloud-ui/config';
import { CONFIG_API_MOCK, Config, configOptions  } from '@identity/config';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { laravel_FIXTURE } from '.';
import { laravelHttpClientMockApiInterceptorService } from './laravel-http-client-mock-api-interceptor.service';
import { laravelHttpClientTestingModule } from './testing/laravel-http-client-testing.module';

describe('laravelHttpClientMockApiInterceptorService', () => {

  let config: Config;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;
  let service: laravelHttpClientMockApiInterceptorService;
  const subscribeSpy = jasmine.createSpy('subscribeSpy');
  const expectedData = { data: true };
  const storageMock = {
    set() {},
    get() {
      return false;
    },
    remove() {},
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        laravelHttpClientTestingModule,
        ConfigModule.forRoot(configOptions),
      ],
      providers: [
        laravelHttpClientMockApiInterceptorService,
        { provide: HTTP_INTERCEPTORS, useClass: laravelHttpClientMockApiInterceptorService, multi: true },
        { provide: LOCAL_STORAGE, useValue: storageMock },
      ],
    });

  });

  beforeEach(() => {

    config = TestBed.inject(CONFIG);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(laravelHttpClientMockApiInterceptorService);
    storageService = TestBed.inject(LOCAL_STORAGE) as typeof storageService;

    config.mockEnabled = true;

  });

  afterEach(() => {

    httpTestingController.verify();

  });

  describe('intercept', () => {

    it('should intercept and return provided fixture', fakeAsync(() => {

      CONFIG_API_MOCK['api'] = [{ url: 'account', method: 'GET', fixture: 'account_fixture' }];
      spyOn(storageService, 'get').and.returnValue('enabled');

      httpClient.get(config.laravel.apiUrl + '/account').subscribe(subscribeSpy);

      tick(2000);

      expect(subscribeSpy).toHaveBeenCalledWith(laravel_FIXTURE.ACCOUNT_FIXTURE);

    }));

    it('should intercept and return default fixture for GET method', fakeAsync(() => {

      CONFIG_API_MOCK['api'] = [{ url: 'account', method: 'GET' }];
      spyOn(storageService, 'get').and.returnValue('enabled');

      httpClient.get(config.laravel.apiUrl + '/account').subscribe(subscribeSpy);

      tick(2000);

      expect(subscribeSpy).toHaveBeenCalledWith(laravel_FIXTURE.ACCOUNT_FIXTURE);

    }));

    it('should intercept and return error when status code is not 200', fakeAsync(() => {

      CONFIG_API_MOCK['api'] = [{ url: 'account', method: 'GET', status: 404 }];
      spyOn(storageService, 'get').and.returnValue('enabled');
      let error;

      httpClient.get(
        config.laravel.apiUrl + '/account',
      ).subscribe(subscribeSpy, response => error = response.error);

      tick(2000);

      expect(error).toEqual({ message: 'Error.' });

    }));

    it('should intercept and return default fixture for any write method', fakeAsync(() => {

      CONFIG_API_MOCK['api'] = [{ url: 'account/uuid', method: 'PUT' }];
      spyOn(storageService, 'get').and.returnValue('enabled');

      httpClient.put(
        config.laravel.apiUrl + '/account/428-92e501d5-9e77-466d-8ecb-cccfce17e7a1',
        { name: 'test' },
      ).subscribe(subscribeSpy);

      tick(2000);

      expect(subscribeSpy).toHaveBeenCalledWith(laravel_FIXTURE.ACTION_RESPONSE_FIXTURE);

    }));

    it('should not intercept', fakeAsync(() => {

      config.mockEnabled = false;

      httpClient.get(config.laravel.apiUrl + '/test').subscribe(subscribeSpy);

      const req = httpTestingController.expectOne(config.laravel.apiUrl + '/test');

      req.flush(expectedData);

      tick(2000);

      expect(subscribeSpy).toHaveBeenCalledWith(expectedData);

    }));

  });

  describe('getApiRegexExpression', () => {

    it('should replace /uuid/ with regex', () => {

      const url = 'test/uuid/accounts/uuid';
      expect(service.getApiRegexExpression(url)).toEqual('test/[0-9a-z-]+/accounts/[0-9a-z-]+$');

    });

    it('should replace /id/ with regex', () => {

      const url = 'test/id/accounts/id';
      expect(service.getApiRegexExpression(url)).toEqual('test/[0-9a-z-]+/accounts/[0-9a-z-]+$');

    });

    it('should replace /name/ with regex', () => {

      const url = 'test/uuid/accounts/name';
      expect(service.getApiRegexExpression(url)).toEqual('test/[0-9a-z-]+/accounts/[0-9a-z-_.]+$');

    });

    it('should keep provided url', () => {

      const url = 'test/428-92e501d5-9e77-466d-8ecb-cccfce17e7a1/accounts/ec9cecfc-1485-4af9-94fa-eb21cd4ad58a';
      expect(service.getApiRegexExpression(url)).toEqual(url + '$');

    });

  });

  describe('getFixtureByRequest', () => {

    it('should return fixture for generic path url', () => {

      const url = 'account';
      const method = 'GET';
      expect(service.getFixtureByRequest(url, method)).toEqual('ACCOUNT_FIXTURE');

    });

    it('should return fixture for full path url', () => {

      const url = 'test/428-92e501d5-9e77-466d-8ecb-cccfce17e7a1/accounts/ec9cecfc-1485-4af9-94fa-eb21cd4ad58a';
      const method = 'GET';
      expect(service.getFixtureByRequest(url, method)).toEqual('TEST_UUID_ACCOUNTS_UUID_FIXTURE');

    });

  });

});
