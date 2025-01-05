import { DxpPaginationInterface } from '@dxp-web/ads-angular';

export interface CollectionInterface<T> {
  total?: number;
  pagination?: DxpPaginationInterface;
  _embedded: {
    items: T[],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _links?: any;
}
