import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { laravelHttpClientErrorHandlerService } from '../laravel-http-client-error-handler.service';
import { laravelHttpClientErrorHandlerTestingService } from './laravel-http-client-error-handler-testing.service';

@NgModule({
  imports: [
    HttpClientTestingModule,
  ],
  providers: [
    { provide: laravelHttpClientErrorHandlerService, useClass: laravelHttpClientErrorHandlerTestingService },
  ],
})
export class laravelHttpClientTestingModule { }
