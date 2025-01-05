import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CollectionParamsInterface } from '@cloud-ui/util';
import { Config } from '@identity/config';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RequestOptions {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | CollectionParamsInterface | {
    [param: string]: string | string[] | number;
  };
  state?: string | any[];
  metadata?: any;
  cache?: boolean;
  apiVersion?: string;
  api?: Config['laravel'] ;
}
