import { HttpParameterCodec } from '@angular/common/http';

/**
 * Custom http param encoder class to fix angular http client bug. Story CXUI-6532
 * See https://medium.com/better-programming/how-to-fix-angular-httpclient-not-escaping-url-parameters-ddce3f9b8746
 */
export class laravelHttpParamEncoder implements HttpParameterCodec {

  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }

}
