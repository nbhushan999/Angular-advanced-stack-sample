import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONFIG } from '@cloud-ui/config';
import { Config, CONFIG_API_MOCK } from '@identity/config';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { of , throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { laravel_FIXTURE } from '.';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable()
export class laravelHttpClientMockApiInterceptorService implements HttpInterceptor {

  // Statically defined as enabled to keep mocking.
  mockServiceEnabled = {
    'laravel': this.localStorage.get('acquia.ui.identity.apiMock') ?? 'enabled',
  };

  constructor(
    @Inject(CONFIG) protected config: Config,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
  ) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler) {

    // return request if mock is not enabled
    if ((!Object.values(this.mockServiceEnabled).some(value => value === 'enabled')) || this.config.mockEnabled === false) {
      return next.handle(req);
    }

    for (const api of CONFIG_API_MOCK.api) {
      if (this.shouldMockResponse(req, api)) {

        const response = this.buildMockResponse(api);

        // eslint-disable-next-line no-console
        console.log(
          'MOCK API:',
          '\n Request Intercepted: ', { method: req.method, url: req.urlWithParams, body: req.body, service: api.apiService || 'laravel' },
          '\n Mock Response:', response);

        return this.getHttpResponse(api.status, response).pipe(delay(api.delay ? api.delay : 200));

      }
    }

    return next.handle(req);

  }

  buildMockResponse(api) {

    if (api.fixtureInstance) {
      return api.fixtureInstance;
    }

    if (api.template) {
      return laravel_FIXTURE[api.template](api.params);
    }

    // Use provided fixture name, otherwise try to find it by url.
    const fixture = api.fixture ? api.fixture.toUpperCase() : this.getFixtureByRequest(api.url, api.method);

    return laravel_FIXTURE[fixture];

  }

  shouldMockResponse(req:any, api:any) {

    const service = api.apiService || 'laravel';
    const host = this.config[service]?.apiUrl || this.config['laravel']?.apiUrl;
    const pathRegex = this.getApiRegexExpression(api.url);

    return this.mockServiceEnabled[service] &&
      req.url.toLowerCase().includes(host) &&
      req.method === api.method &&
      req.url.toLowerCase().match(pathRegex);

  }

  // Convert API url to regex expression. Replace '/' to '\/', 'uuid', 'id' to '[0-9a-z-]+', 'name' to '[0-9a-z-_]+'
  getApiRegexExpression(url: string) {

    let regex = url.replace(/\//g, '\/');
    regex = regex.replace(/\/uuid/g, '\/[0-9a-z-]+');
    regex = regex.replace(/\/id/g, '\/[0-9a-z-]+');
    regex = regex.replace(/\/name/g, '\/[0-9a-z-_.]+');
    regex += '$';

    return regex;

  }

  // Get fixture name by provided url
  getFixtureByRequest(url: string, method: string) {

    if (method !== 'GET') {
      return 'ACTION_RESPONSE_FIXTURE';
    }

    let fixture = url.replace(/\/[0-9a-z-]{32,}[\/]*/g, '/uuid/');
    fixture = fixture.replace(/\/$/, '');
    fixture = fixture.replace(/\//g, '_');
    fixture += '_FIXTURE';
    fixture = fixture.toUpperCase();
    return fixture;

  }

  // Return HTTP response.
  getHttpResponse(status = 200, body?) {

    if (status === 200) {
      return of(new HttpResponse({status, body}));
    } else {
      return throwError(new HttpErrorResponse({ status, error: { message: 'Error.' } }));
    }

  }

}
