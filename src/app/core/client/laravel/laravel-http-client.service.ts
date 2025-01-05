import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONFIG } from '@cloud-ui/config';
import { Config } from '@identity/config';
import { Observable } from 'rxjs';
import { laravelHttpParamEncoder } from '../laravel-http-param-encoder';
import { RequestOptions } from '../request-options.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({ providedIn: 'root' })
export class laravelHttpClientService {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(CONFIG) protected config: Config,
  ) {
  }

  public get(path: string, options: RequestOptions = {}): Observable<any> {

    return this.http.get(this.buildUrl(path, options.api), this.buildOptions(options));

  }

  public post(path: string, body: any = {}, options: RequestOptions = {}): Observable<any> {

    return this.http.post(this.buildUrl(path, options.api), body, this.buildOptions(options));

  }

  public patch(path: string, body: any = {}, options: RequestOptions = {}): Observable<any> {

    return this.http.patch(this.buildUrl(path, options.api), body, this.buildOptions(options));

  }

  public put(path: string, body: any = {}, options: RequestOptions = {}): Observable<any> {

    return this.http.put(this.buildUrl(path, options.api), body, this.buildOptions(options));

  }

  public delete(path: string, options: RequestOptions = {}): Observable<any> {

    return this.http.delete(this.buildUrl(path, options.api), this.buildOptions(options));

  }

  public options(path: string, options: RequestOptions = {}): Observable<any> {

    return this.http.options(this.buildUrl(path, options.api), this.buildOptions(options));

  }

  public head(path: string, options: RequestOptions = {}): Observable<any> {

    return this.http.head(this.buildUrl(path, options.api), this.buildOptions(options));

  }

  protected buildUrl(path: string, api: RequestOptions['api'] = this.config.laravel): string {

    return api.apiUrl + path;

  }

  protected buildOptions(opts: RequestOptions): any {

    const cache = opts.cache !== false;
    const apiVersion = opts.apiVersion || this.config.laravel.apiVersion;

    const headers = {
      ...opts.headers,
      'Accept': 'application/json, version=' + apiVersion,
    };

    if (!cache) {
      headers['X-laravel-Http-Client-Cache'] = 'no-cache';
    }

    const options = {
      ...opts,
      params: new HttpParams({
        fromObject: opts.params as { [param: string]: string },
        encoder: new laravelHttpParamEncoder(),
      }),
      headers: new HttpHeaders(headers),
      responseType: 'json',
    };

    return options;

  }

}
